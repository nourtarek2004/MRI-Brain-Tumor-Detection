import React from 'react'

export default function Work() {
  return <>
    <section className="bg-[#c4d6ff] py-20" >
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-3">How it works ?</h2>
    <p className="text-gray-600 mb-12">
      Discover how our AI system analyzes MRI scans and delivers precise,
      easy-to-understand results.
    </p>

    <div className="grid md:grid-cols-4 gap-6">
      {[
        {
          step: "01",
          title: "Upload MRI Scan",
          desc: "Patient uploads brain MRI scan to the system.",
        },
        {
          step: "02",
          title: "AI Analysis",
          desc: "Our deep learning model processes and detects tumor regions.",
        },
        {
          step: "03",
          title: "Doctor Review",
          desc: "Doctors review results and add medical notes.",
        },
        {
          step: "04",
          title: "Final Report",
          desc: "The complete report is generated and sent to the patient.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-md text-center"
        >
          <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
            {item.step}
          </div>
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  </>
}
