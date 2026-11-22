import React, { useEffect, useState ,useRef } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import NavRole from "../../NavRole/NavRole";
import { jsPDF } from "jspdf";
import { FaVolumeUp } from "react-icons/fa";
import npyjs from "npyjs";
export default function PatientScan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const report = result?.reports?.[0]; // أهم جزء
  const [scanType, setScanType] = useState("2d");
  const [flairFile, setFlairFile] = useState(null);
  const [t2File, setT2File] = useState(null);

  const [prediction, setPrediction] = useState(null);
  const [maskData, setMaskData] = useState(null);
  const [sliceIndex, setSliceIndex] = useState(0);

  const canvasRef = useRef(null);
    

  function handleFileChange(e) {
     const selectedFile = e.target.files[0];

       if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ================= CONFIDENCE FORMAT =================
  const formatConfidence = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (value > 1) return `${value.toFixed(1)}%`;
    return `${(value * 100).toFixed(1)}%`;
  };
  

  // ================= UPLOAD =================
  async function handleUpload() {
    const formData = new FormData();

    if (scanType === "2d") {
      if (!file)
        return alert("Please select MRI image");

      formData.append("scanImage", file);
    }

    if (scanType === "3d") {
      if (!flairFile || !t2File)
        return alert("Please upload FLAIR and T2 files");

      formData.append("flair_file", flairFile);
      formData.append("t2_file", t2File);
    }

    try {
      setLoading(true);
      setResult(null);
      setPrediction(null);

      const res = await axios.post(
        "https://mri-production-7e28.up.railway.app/api/patient/scans/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem( "token" )}`,
          },
        }
      );

      if (scanType === "2d") {
        setScanId(res.data.data._id);
      }

      if (scanType === "3d") {
        setPrediction(res.data.prediction);
      }
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // ================= POLLING =================
  useEffect(() => {
    if (!scanId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
         ` https://mri-production-7e28.up.railway.app/api/patient/scans/result/${scanId}`,
          {
            headers: {
              Authorization:` Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.data;

        setResult({ scan: data.scan,reports: data.reports || [], });

        if ( data.scan.status === "Completed" || data.scan.status === "Rejected") {
          clearInterval(interval);
        }
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          alert("Session expired");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scanId]);

      useEffect(() => {
      if (!prediction?.mask) return;

      loadMask();
    }, [prediction]);
      const loadMask = async () => {
        try {
          const binary = atob(
            prediction.mask
          );

          const bytes = new Uint8Array(
            [...binary].map((c) =>
              c.charCodeAt(0)
            )
          );

          const npy = new npyjs();

          const parsed =await npy.load(bytes.buffer);

          setMaskData({
            data: parsed.data,
            shape: parsed.shape,
          });

          setSliceIndex( Math.floor( parsed.shape[0] / 2) );
        } catch (err) {
          console.log(err);
        }
      };

      useEffect(() => {
        if (!maskData) return;

        drawSlice();
      }, [maskData, sliceIndex]);
        const drawSlice = () => {

          if (!maskData) return;

          const canvas =canvasRef.current;

          if (!canvas) return;

          const ctx =canvas.getContext("2d");

          const [depth, height, width] = maskData.shape;

          canvas.width = width;
          canvas.height = height;

          const imageData =
            ctx.createImageData(
              width,height
            );

          const sliceOffset =sliceIndex *width *height;

          for (let y = 0;y < height;y++) {
            for (let x = 0;x < width;x++ ) {

              const voxel = maskData.data[sliceOffset + y * width + x ];

              const idx =(y * width + x) * 4;

              if (voxel > 0) {

                imageData.data[idx] = 255;
                imageData.data[idx + 1] = 0;
                imageData.data[idx + 2] = 0;
                imageData.data[idx + 3] = 255;

              } else {

                imageData.data[idx] = 0;
                imageData.data[idx + 1] = 0;
                imageData.data[idx + 2] = 0;
                imageData.data[idx + 3] = 255;
              }
            }
          }

          ctx.putImageData(imageData,0,0 );
        };






  const isTumor = report?.tumorType && report.tumorType.toLowerCase() !== "normal";

  const downloadMask = () => {
      if (!prediction?.mask) return;

      const byteCharacters = atob(  prediction.mask);

      const byteNumbers = Array.from(
        byteCharacters,
        (c) => c.charCodeAt(0));

      const blob = new Blob(
        [new Uint8Array(byteNumbers)],
        {
          type: "application/octet-stream",
        }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "tumor_mask.npy";
      a.click();
};
    const get3DExplanation = () => {
      if (!prediction) return "";

      if (prediction.tumor_detected) {
        return "The AI analysis detected signs that may indicate a brain tumor. Please consult a specialist doctor for a detailed medical evaluation.";
      }

      return "The AI analysis did not detect obvious signs of a brain tumor in the uploaded MRI scan.";
    };
         const downloadMaskPDF = () => {
                if (!canvasRef.current) return;

                const pdf = new jsPDF();

                pdf.setFontSize(18);
                pdf.text("Brain Tumor Segmentation Report", 20, 20);

                pdf.setFontSize(12);

                pdf.text(
                  `Tumor Detected: ${
                    prediction.tumor_detected ? "Yes": "No"
                  }`,
                  20,40
                );

                pdf.text(
                  `Tumor Voxels: ${prediction.tumor_voxels}`,
                  20,50
                );

                pdf.text(
                 ` Mask Shape: ${prediction.mask_shape.join( " x " )}`,
                  20,60
                );

                const imgData =
                  canvasRef.current.toDataURL(
                    "image/png"
                  );

                pdf.addImage(
                  imgData,"PNG",20, 80, 120, 120
                );

                pdf.save(
                  "tumor-segmentation-report.pdf"
                );
              };

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] pt-24 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-xl font-semibold mb-2">
            Upload MRI Scan
          </h1>
         <div className="bg-white rounded-xl p-2 shadow-sm flex gap-2 mb-6 w-fit">
            <button onClick={() => setScanType("2d")} className={`px-6 py-2 rounded-lg font-medium transition-all ${
                scanType === "2d" ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>2D MRI</button>

            <button onClick={() => setScanType("3d")}  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                scanType === "3d"? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            > 3D MRI</button>
         </div>
          <p className="text-gray-500 mb-6 text-sm">
           {scanType === "2d "? "Upload your MRI image below and let AI analyze it": "Upload FLAIR and T2 files for 3D analysis"}
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* UPLOAD */}
           <div className="bg-white p-6 rounded-xl shadow h-full  pt-20">
             {scanType === "2d" && (
               <>
                <input type="file" hidden id="file" onChange={handleFileChange} />

                 <label htmlFor="file" className="cursor-pointer">
                  <div className="border-2 border-dashed p-8 text-center rounded-xl">

                    {preview ? (<img src={preview}  className="w-40 mx-auto mb-4" />) : (
                         <FaUpload className="text-4xl mx-auto text-blue-500 mb-3" />
                           )}

                              <p className="text-gray-500"> Upload MRI Image</p>
                                         
                                       


                    </div>

                  </label>

                </>
              )}
           {scanType === "3d" && (
            <div className="space-y-4">

              <label  htmlFor="flair"  className="block border-2 border-dashed border-blue-200 rounded-xl p-6 cursor-pointer hover:bg-blue-50 transition min-h-[180px] flex items-center justify-center">
                <div className="text-center">
                  <FaUpload className="mx-auto text-3xl text-blue-500 mb-3" />

                  <p className="font-medium">
                    Upload FLAIR Scan
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {flairFile ? flairFile.name : ".nii or .nii.gz"}
                  </p>
                </div>

                <input
                  id="flair"
                  type="file"
                  hidden
                  accept=".nii,.nii.gz"
                  onChange={(e) =>
                    setFlairFile(e.target.files[0])
                  }
                />
              </label>

                    <label htmlFor="t2" className="block border-2 border-dashed border-purple-200 rounded-xl p-6 cursor-pointer hover:bg-purple-50 transition min-h-[180px] flex items-center justify-center">
                          <div className="text-center">
                            <FaUpload className="mx-auto text-3xl text-purple-500 mb-3" />

                            <p className="font-medium">
                              Upload T2 Scan
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {t2File? t2File.name : ".nii or .nii.gz"}
                            </p>
                          </div>

                          <input
                              id="t2"
                              type="file"
                              hidden
                              accept=".nii,.nii.gz"
                              onChange={(e) =>
                                setT2File(e.target.files[0])
                              }
                            />
                    </label>

            </div>
           )}
             

              <button onClick={handleUpload} disabled={loading}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg" >{loading ? "Uploading..." : "Upload & Analyze"}
              </button>
            </div>

              {/* RESULT CARD */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl text-gray-800"> Analysis Result</h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {scanType?.toUpperCase()}
                  </span>
                </div>

                {/* NO RESULT STATE */}
                {!report && !prediction && (
                  <p className="text-gray-400 text-center py-6">No result yet </p>
                )}

                {/* PREDICTION SECTION */}
                {prediction && (
                  <div className="space-y-5">

                    {/* RESULT BADGE + SUMMARY */}
                    <div className="flex items-start justify-between gap-4 bg-gray-50 p-4 rounded-xl">
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          AI Analysis Result
                        </p>

                        <p className="text-sm text-gray-600 mt-2 leading-6">
                          {get3DExplanation()}
                        </p>
                        {scanType === "3d" && prediction && (
                                <div className="mt-4 bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-sm leading-7"
                                    style={{ direction: "rtl" , textAlign: "right",  }} >
                                                    {prediction.tumor_detected ? (
                                                      <>
                                                        🧠 <b>معلومة تساعدك تفهم النتيجة:</b>
                                                        <br />
                                                        النظام بيحلل صور الـ 3D (FLAIR + T2) عشان يحدد أي تغيّرات في أنسجة المخ.  
                                                        ظهور نتيجة “احتمال وجود ورم” يعني إن في مناطق محتاجة مراجعة طبية دقيقة.  
                                                        مهم جدًا إن النتيجة تعتبر <b>مساعدة وليست تشخيص نهائي</b>.
                                                      </>
                                                    ) : (
                                                      <>
                                                        🌷 <b>معلومة مطمّنة:</b>
                                                        <br />
                                                        تحليل الـ 3D بيقارن بين طبقات المخ المختلفة، ولو مفيش أي تغيّرات غير طبيعية فده غالبًا مؤشر مطمئن.  
                                                        يفضل المتابعة لو في أعراض مستمرة.
                                                      </>
                                                    )}
                                                  </div>
                                                                                )}
                                                                        </div>

                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                          prediction.tumor_detected ? "bg-red-100 text-red-700": "bg-green-100 text-green-700"
                        }`}
                      >
                        {prediction.tumor_detected ? "Possible Tumor" : "No Tumor"}
                      </span>
                    </div>

                 
                 {maskData && (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 border rounded-2xl p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-3 mb-4">

                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <p className="text-xs text-gray-500">
                        Tumor Voxels
                      </p>

                      <p className="font-bold text-lg">
                        {prediction.tumor_voxels}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <p className="text-xs text-gray-500">
                        Volume Shape
                      </p>

                      <p className="font-bold text-lg">
                        {prediction.mask_shape?.join(" × ")}
                      </p>
                    </div>

                  </div>    
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">
                      Tumor Segmentation Mask
                    </h4>

                    <span className="text-sm text-gray-500">
                      Slice {sliceIndex + 1} / {maskData.shape[0]}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={maskData.shape[0] - 1}
                    value={sliceIndex}
                    onChange={(e) =>
                      setSliceIndex(Number(e.target.value))
                    }
                    className="w-full accent-blue-600 cursor-pointer mb-4"
                  />

                  <div className="flex justify-center mt-4">
                      <div className="bg-black rounded-xl p-3 shadow-inner">
                        <canvas
                          ref={canvasRef}
                          className="rounded-lg w-[350px] h-[350px]"
                        />
                      </div>
                   </div>
                 
                </div>
              )}

                    {/* DOWNLOAD BUTTON */}
                    {prediction.mask && (
                      <button onClick={downloadMaskPDF}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
                      >
                        Download Segmentation Mask
                      </button>
                    )}
                  </div>
                )}

                {/* REPORT SECTION */}
                {report && (
                  <div className={`p-5 rounded-2xl border space-y-4 ${
                      isTumor ? "bg-red-50 border-red-200": "bg-green-50 border-green-200"
                    }`}
                  >

                    <h3  className={`font-bold text-lg ${
                        isTumor ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isTumor ? "Tumor Detected" : "Normal Scan"}
                    </h3>

                    {/* TYPE */}
                    <div className="bg-white p-4 rounded-xl">
                      <p className="text-xs text-gray-500">Tumor Type</p>
                      <p className={`font-semibold $ {isTumor ? "text-red-600" : "text-green-600"}`}>
                        {report.tumorType}
                      </p>
                    </div>

                    {/* CONFIDENCE */}
                    <div className="bg-white p-4 rounded-xl">
                      <p className="text-xs text-gray-500">Confidence</p>
                      <p className="font-semibold text-gray-800">
                        {formatConfidence(report.confidenceScore)}
                      </p>
                    </div>
                    {scanType === "2d" && report && (
                            <div className="bg-blue-6 border border-blue-200 p-4 rounded-xl text-sm text-gray-800 leading-6">
                              {isTumor ? (
                                <>
                                  ⚠️ <b>معلومة مهمة:</b><br />
                                  النتيجة بتوضح احتمال وجود مشكلة، بس ده مش تشخيص نهائي.  
                                  الأفضل تعرض الأشعة على دكتور مخ وأعصاب عشان التأكيد.  
                                  لو عندك صداع مستمر أو دوخة، متتأخرش في المتابعة.
                                </>
                              ) : (
                                <>
                                  🌷 <b>الحمد لله:</b><br />
                                  النتيجة شكلها مطمّن ومفيش علامات واضحة على ورم.  
                                  لو عندك أي أعراض بسيطة قبل كده فهي غالبًا مش مرتبطة بالخطورة.  
                                  خليك بس على متابعة دورية للاطمئنان.
                                </>
                              )}
                            </div>
                          )}

                    {/* NOTES */}
                    <div
                      className={`p-4 rounded-xl text-sm font-medium ${
                        isTumor ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {report.notes || (isTumor ? "Please consult your doctor." : "Your MRI scan appears normal.")}
                    </div>

                  </div>
                )}

              </div>

          </div>
        </div>
      </div>
    </>
  );
}