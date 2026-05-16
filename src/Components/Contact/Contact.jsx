import React from 'react'
export default function Contact() {
  return (
    <section className="bg-[#FFFFFF] py-16 md:py-24" >
      <div className="container mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Contact Us
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Have questions? Our team is ready to help you with AI-powered medical solutions.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Left info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Get in touch
            </h3>

            <p className="text-gray-500">
              Fill out the form and our support team will get back to you shortly.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-[#409BFF] text-white flex items-center justify-center rounded-full">📍
                </span>
                <span className="text-gray-600 text-sm">
                  Cairo, Egypt
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-[#409BFF] text-white flex items-center justify-center rounded-full">
                  📧
                </span>
                <span className="text-gray-600 text-sm">
                  support@tumorx.ai
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-[#409BFF] text-white flex items-center justify-center rounded-full"> 📞
                </span>
                <span className="text-gray-600 text-sm">
                  +20 100 000 0000
                </span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#407BFF]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#407BFF]"
              />
            </div>

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#407BFF]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#409BFF] text-white py-3 rounded-lg font-semibold hover:bg-[#3069E0] transition"
            >
              Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
