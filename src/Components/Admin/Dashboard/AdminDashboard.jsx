import React from 'react'
import NavRole from '../../NavRole/NavRole'

import { useEffect, useState } from "react";
import axios from "axios";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    try {
      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData =
    dashboard?.monthlyActivity?.map((item) => ({
      month: monthNames[item._id - 1],
      count: item.count,
    })) || [];

  const tumorData =
    dashboard?.tumorTypes?.map((item) => ({
      name: item.tumorName,
      value: item.count,
    })) || [];

  const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F97316",
    "#EF4444",
  ];

  if (loading) {
    return (
      <>
        <NavRole />
        <div className="min-h-screen flex justify-center items-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 md:p-8">

        {/* Header */}
        <div className="mt-10 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Overview of the entire Brain AI system.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <Card
            title="Total Doctors"
            value={dashboard?.totalDoctors || 0}
          />

          <Card
            title="Total Patients"
            value={dashboard?.totalPatients || 0}
          />

          <Card
            title="Scans Analyzed"
            value={dashboard?.scansAnalyzed || 0}
          />

          <Card
            title="AI Accuracy Avg"
            value={dashboard?.aiAccuracyAvg || "0%"}
          />

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">

            <h3 className="font-semibold mb-5">
              Monthly Activity
            </h3>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">

            <h3 className="font-semibold mb-5">
              Tumor Distribution
            </h3>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>

                <Pie
                  data={tumorData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {tumorData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <p className="text-gray-500 text-sm mb-2">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-blue-500">
        {value}
      </h3>

    </div>
  );
}
