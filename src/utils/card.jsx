// src/components/Card.jsx
export default function Card({ title, children }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-gray-600 mt-2">{children}</div>
      </div>
    );
  }
  