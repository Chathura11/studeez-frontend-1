import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-900 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">About Studeez</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
          Studeez is your smart learning companion — connecting students, teachers, and resources in one simple platform.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-xl p-8 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-3 text-teal-600">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To empower students and teachers with an easy-to-use digital platform 
            that makes learning more accessible, engaging, and effective.
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-8 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-3 text-blue-900">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the leading educational platform where technology bridges 
            the gap between teaching and learning, fostering knowledge for everyone.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Studeez Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Whether you are a student eager to learn or a teacher passionate about sharing knowledge, 
          Studeez is the place for you.
        </p>
        <a
          href="/register"
          className="px-6 py-3 bg-accent text-white rounded-lg shadow hover:bg-blue-900 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
