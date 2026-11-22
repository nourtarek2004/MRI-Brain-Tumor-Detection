import React from 'react'
import hero from "../../assets/hero.png"
export default function Hero() {
  return <>
 <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

        {/* Text */}
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Revolutionizing Brain <br />
             <span className="text-[#407BFF]">Tumor </span>  
            <span>Detection with AI</span>
          </h1>

          <p className="text-gray-500 mt-5 max-w-lg">
            Analyze brain MRI scans with advanced AI to detect tumors accurately
            and generate smart medical reports.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-[#407BFF] hover:bg-[#3069E0] text-white px-8 py-3 rounded-lg font-medium">
              Get Started
            </button>
            <button className="border border-[#407BFF] text-[#407BFF] px-8 py-3 rounded-lg hover:bg-[#EAF0FF]   "  >
              Learn More
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={hero}
            alt="AI Brain"
            className="w-64 md:w-80 lg:w-96"
          />

    <div>
      
    </div>
        </div>
        </div>
    </div>

  </>
}
