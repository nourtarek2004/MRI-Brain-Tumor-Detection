import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavRole from "../../NavRole/NavRole";

export default function PatientDetails() {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  async function fetchPatient() {
    try {
      const res = await axios.get(
        `https://mri-production-7e28.up.railway.app/api/admin/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatient(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  if (!patient) return <div>Loading...</div>;

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-8  mt-5">

        <div className="bg-white rounded-2xl p-8 shadow-sm">

          <div className="flex items-center gap-5">

            <img
              src={patient.profileImage}
              className="w-24 h-24 rounded-full"
              alt=""
            />

            <div>
              <h2 className="text-2xl font-bold">
                {patient.username}
              </h2>

              <p>{patient.email}</p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <Info
              title="Role"
              value={patient.role}
            />

            <Info
              title="Created"
              value={new Date(
                patient.createdAt
              ).toLocaleString()}
            />

          </div>

          {patient.lastScan && (
            <div className="mt-8 border-t pt-6">

              <h3 className="font-bold text-xl mb-4">
                Last Scan
              </h3>

              <Info
                title="Scan Type"
                value={patient.lastScan.scanType}
              />

              <Info
                title="Status"
                value={patient.lastScan.status}
              />

              <Info
                title="Scan Date"
                value={new Date(
                  patient.lastScan.scanDate
                ).toLocaleString()}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-gray-500">{title}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}