import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { SubmissionsUpload } from "../../utils/fileUpload";
import toast from "react-hot-toast";

export default function StudentAssignmentSubmitPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch assignment
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setAssignment(data);
        const now = new Date();
        if (new Date(data.dueAt) < now) {
          setIsOverdue(true);
        }
      })
      .catch(() => {});

    // Fetch student's submission
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/submission/assignment/${assignmentId}/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setSubmission(res.data);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newFileUrl = "";
    if (fileUrl) {
      newFileUrl = await SubmissionsUpload(fileUrl[0]);
    } else {
      toast.error("Please attach a file!");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submission`,
        { assignmentId, files: [newFileUrl] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Submitted!");
      navigate(`/student/class/${assignment?.class}/assignments`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Submit — {assignment.title}</h1>
          <Link
            to={`/student/class/${assignment.class}/assignments`}
            className="text-blue-600 underline"
          >
            Back
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
        <p className="text-xs text-gray-500 mb-6">
          Due: {new Date(assignment.dueAt).toLocaleString()}
        </p>

        {/* If not yet submittion grade, show form */}
        {!(submission && submission.grade) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              name="file"
              onChange={(e) => setFileUrl(e.target.files)}
              className="w-full border rounded p-2 mb-3"
              disabled={isOverdue}
            />
            <button
              type="submit"
              disabled={submitting || isOverdue}
              className={`px-4 py-2 rounded text-white ${
                isOverdue
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 cursor-pointer"
              }`}
            >
              {isOverdue
                ? "Deadline Passed"
                : submitting
                ? "Submitting..."
                : "Submit"}
            </button>
          </form>
        )}

        {/* Student’s submission */}
        {submission && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Your Submission</h2>
            <p className="text-sm text-gray-600">
              Submitted at: {new Date(submission.submittedAt).toLocaleString()}
            </p>

            {submission.textAnswer && (
              <p className="mt-2 p-2 bg-gray-100 rounded">
                {submission.textAnswer}
              </p>
            )}

            {submission.files?.length > 0 && (
              <div className="mt-3 space-y-2">
                {submission.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block"
                  >
                    File {idx + 1}
                  </a>
                ))}
              </div>
            )}

            {/* Grade Section */}
            {submission.grade && (
              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <h3 className="text-md font-semibold text-green-700">
                  Grade
                </h3>
                <p className="text-sm">Score: {submission.grade.score}</p>
                <p className="text-sm">Feedback: {submission.grade.feedback}</p>
                <p className="text-xs text-gray-500">
                  Graded at:{" "}
                  {new Date(submission.grade.gradedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
