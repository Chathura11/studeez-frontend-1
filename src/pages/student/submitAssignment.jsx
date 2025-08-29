import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmitAssignment({ assignmentId }) {
  const token = localStorage.getItem("token");
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ textAnswer: "", files: "" });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/assignment/${assignmentId}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMe(res.data || null));
  }, [assignmentId]);

  const submit = (e) => {
    e.preventDefault();
    const files = form.files
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
        { assignmentId, textAnswer: form.textAnswer, files },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMe(res.data));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Submit Assignment</h3>
      {me && (
        <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm">You submitted on {new Date(me.submittedAt).toLocaleString()}</div>
          {me.grade?.score !== undefined && (
            <div className="text-sm mt-1">
              Grade: <span className="font-semibold">{me.grade.score}</span>{" "}
              {me.grade.feedback && <span> • {me.grade.feedback}</span>}
            </div>
          )}
        </div>
      )}
      <form onSubmit={submit} className="space-y-3">
        <textarea
          className="w-full border rounded p-2"
          placeholder="Text answer (optional)"
          value={form.textAnswer}
          onChange={(e) => setForm((f) => ({ ...f, textAnswer: e.target.value }))}
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Paste file URLs here (one per line)"
          value={form.files}
          onChange={(e) => setForm((f) => ({ ...f, files: e.target.value }))}
        />
        <button className="px-4 py-2 bg-[#037c6e] text-white rounded-lg hover:bg-[#025043]">
          {me ? "Resubmit" : "Submit"}
        </button>
      </form>
    </div>
  );
}
