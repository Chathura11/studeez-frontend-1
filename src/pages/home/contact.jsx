import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-16">

      <h1 className="text-4xl md:text-5xl font-bold text-[#3674B5] mb-4">Contact Us</h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 text-center">
        Have questions or need assistance? Get in touch with us!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center border-t-4 border-[#3674B5] transition">
          <FaPhoneAlt className="text-4xl text-[#3674B5] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Call Us</h3>
          <p className="text-gray-600">+94 763912183</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center border-t-4 border-[#3674B5] transition">
          <FaEnvelope className="text-4xl text-[#3674B5] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Email</h3>
          <p className="text-gray-600">chathuraasela11@gmail.com</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center border-t-4 border-[#3674B5] transition">
          <FaMapMarkerAlt className="text-4xl text-[#3674B5] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Location</h3>
          <p className="text-gray-600">123 Main Street, Colombo, Sri Lanka</p>
        </div>

      </div>

    </div>
  );
}
