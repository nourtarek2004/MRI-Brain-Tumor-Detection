import React from 'react'

export default function About() {
  return <>
  <section className="py-20 bg-white" >
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-3">Why Choose TumorX?</h2>
    <p className="text-gray-600 mb-12">
      Discover what makes our AI-powered MRI analysis system smart, fast,
      and reliable.
    </p>

    <div className="grid md:grid-cols-2 gap-6">
      <div className=" border-2   border-[#7fa7ff] rounded-xl p-6 text-left">
        <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
        <p className="text-gray-500 text-sm">
          Provides personalized follow-up tips tailored to the patient's condition.
        </p>
      </div>

      <div className="border-2   border-[#7fa7ff] rounded-xl p-6 text-left">
        <h3 className="font-semibold mb-2">AI-Powered Tumor Detection</h3>
        <p className="text-gray-500 text-sm">
          Our deep learning model detects brain tumors with high accuracy,
          minimizing false negatives.
        </p>
      </div>

      <div className="border-2   border-[#7fa7ff] rounded-xl p-6 text-left">
        <h3 className="font-semibold mb-2">Easy Tracking</h3>
        <p className="text-gray-500 text-sm">
          Patients can view their full report history anytime from their dashboard.
        </p>
      </div>

      <div className="border-2   border-[#7fa7ff] rounded-xl p-6 text-left">
        <h3 className="font-semibold mb-2">Automated Report Generation</h3>
        <p className="text-gray-500 text-sm">
          Instantly generates a detailed medical report with analysis,
          visuals, and confidence levels.
        </p>
      </div>
    </div>
  </div>
</section>

  </>
}
