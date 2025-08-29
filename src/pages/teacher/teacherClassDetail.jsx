import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {AssignmentsUpload,MaterialsUpload} from'../../utils/fileUpload';
import toast from "react-hot-toast";

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-lg border-b-2 cursor-pointer ${
        active ? "border-[#037c6e] text-[#037c6e]" : "border-transparent text-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

export default function TeacherClassDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [cls, setCls] = useState(null);
  const [tab, setTab] = useState("requests"); // requests | assignments | submissions | materials | announcements | attendance

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", instructions: "", dueAt: "" ,attachments:[]});

  // data buckets
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [ann, setAnn] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [subs, setSubs] = useState([]);
  const [file,setFile] = useState(null);
  const [matFile,setMatFile] = useState(null);

  // forms
  const [newAsg, setNewAsg] = useState({ title: "", instructions: "", dueAt: "",attachments:[] });
  const [newMat, setNewMat] = useState({ title: "", description: "", fileUrl: "" });
  const [newAnn, setNewAnn] = useState({ title: "", message: "", pinned: false });

  // attendance
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [attDate, setAttDate] = useState(today);
  const [attEntries, setAttEntries] = useState([]); // [{student, status, note}]

  //zoom
  const [zoomLinks, setZoomLinks] = useState([]);
  const [newZoom, setNewZoom] = useState({ date: today, zoomLink: "" });

  useEffect(() => {
    // get class info + students
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found = (res.data || []).find((c) => c._id === id);
        setCls(found || null);
        // bootstrap attendance entries
        const entries = (found?.students || []).map((s) => ({
          student: s._id,
          name: s.name,
          status: "present",
          note: "",
        }));
        setAttEntries(entries);
      });

    // requests
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes/${id}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data || []));

    // assignments
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAssignments(res.data || [])
      });

    // materials
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/material/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMaterials(res.data || []));

    // announcements
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/announcement/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnn(res.data || []));

    // zoom links
    axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${id}/zoom-links`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setZoomLinks(res.data || []));

  }, [id]);

  function fetchZoomLinks(){
    axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${id}/zoom-links`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setZoomLinks(res.data || []));
  }

  // ---------- Requests ----------
  const approveRequest = (studentId) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes/${id}/requests/approve`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setRequests((prev) => prev.filter((r) => r._id !== studentId)));
  };

  const removeRequest = (studentId) => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes/${id}/requests/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setRequests((prev) => prev.filter((r) => r._id !== studentId)));
  };

  const removeStudent = (studentId) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes/${id}/students/remove`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCls((prev) => ({
          ...prev,
          students: prev.students.filter((s) => s._id !== studentId),
        }));
      });
  };

  // ---------- Assignments ----------
  const createAssignment = async (e) => {
    e.preventDefault();

    let newFileUrl;
    if(file){
      newFileUrl = await AssignmentsUpload(file[0]);
    }else{
      toast.error('Please insert the attachment!');
      return;
    }

    newAsg.attachments.push(newFileUrl);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignment`,
        { classId: id, ...newAsg},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAssignments((p) => [res.data, ...p]);
        setNewAsg({ title: "", instructions: "", dueAt: "",attachments:[] });
        setFile(null);
      });
  };

  // update assignment
  const updateAssignment = async (assignmentId, updatedData) => {

    let newFileUrl;

    if(file){
      newFileUrl = await AssignmentsUpload(file[0]);
    }

    let newData ={}

    if(newFileUrl){
      newData ={ 
        title: updatedData.title, 
        instructions: updatedData.instructions, 
        dueAt: updatedData.dueAt ,
        attachments:[newFileUrl]
      }
    }else{
      newData ={ 
        title: updatedData.title, 
        instructions: updatedData.instructions, 
        dueAt: updatedData.dueAt
      }
    }

    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/${assignmentId}`, newData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAssignments((prev) =>
          prev.map((a) => (a._id === assignmentId ? res.data : a))
        );
        toast.success("Assignment updated!");
        setFile(null);
      })
      .catch(() => toast.error("Failed to update assignment"));
  };

  // delete assignment
  const deleteAssignment = (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
        toast.success("Assignment deleted!");
      })
      .catch(() => toast.error("Failed to delete assignment"));
  };

  const openSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/${assignment._id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubs(res.data || []));
    setTab("submissions");
  };

  const gradeOne = (submissionId, score, feedback) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignment/${selectedAssignment._id}/submissions/${submissionId}/grade`,
        { score, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) =>
        setSubs((prev) =>
          prev.map((s) => (s._id === submissionId ? res.data.submission : s))
        )
      );
  };

  // ---------- Materials ----------
  const addMaterial =async (e) => {
    e.preventDefault();

    let newFileUrl="";
    if(matFile){
      newFileUrl = await MaterialsUpload(matFile[0]);
    }else{
      toast.error('Please insert the attachment!');
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/material`,
        { classId: id, ...newMat,fileUrl:newFileUrl, links: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMaterials((p) => [res.data, ...p]);
        setNewMat({ title: "", description: "", fileUrl: "" });
        setMatFile(null);
      });
  };

  const removeMaterial = (materialId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/material/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setMaterials((p) => p.filter((m) => m._id !== materialId)));
  };

  // ---------- Announcements ----------
  const addAnnouncement = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/announcement`,
        { classId: id, ...newAnn },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAnn((p) => [res.data, ...p]);
        setNewAnn({ title: "", message: "", pinned: false });
      });
  };

  const togglePin = (annId, pinned) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/announcement/${annId}`,
        { pinned: !pinned },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setAnn((p) => p.map((a) => (a._id === annId ? res.data : a))));
  };

  const deleteAnn = (annId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/announcement/${annId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAnn((p) => p.filter((a) => a._id !== annId)));
  };

  // ---------- Attendance ----------
  const loadAttendance = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/attendance/class/${id}?date=${attDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const fromServer = res.data?.entries || [];
        // merge with current student list to keep consistent order
        const map = new Map(fromServer.map((e) => [e.student?._id || e.student, e]));
        const merged = (cls?.students || []).map((s) => {
          const hit = map.get(s._id);
          return {
            student: s._id,
            name: s.name,
            status: hit?.status || "present",
            note: hit?.note || "",
          };
        });
        setAttEntries(merged);
      });
  };

  const saveAttendance = () => {
    const payload = {
      classId: id,
      date: attDate,
      entries: attEntries.map((e) => ({ student: e.student, status: e.status, note: e.note })),
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/mark`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Attendance updated successfully!");
        loadAttendance()
      });
  };

  // create or update zoom link
  const saveZoomLink = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${id}/zoom-link`,
        newZoom,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        // if updated, replace in list, else add new
        console.log(res.data);
        setZoomLinks((prev) => {
          const exists = prev.find((z) => z._id === res.data.zoomLink._id);
          if (exists) {
            return prev.map((z) =>
              z._id === res.data.zoomLink._id ? res.data.zoomLink : z
            );
          }
          return [res.data.zoomLink, ...prev];
        });
        setNewZoom({ date: today, zoomLink: "" });
      });
  };

  // delete
  const deleteZoomLink = (linkId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/zoom-link/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setZoomLinks((p) => p.filter((z) => z._id !== linkId)));
  };

  const changeStatus = (linkId, status) => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${linkId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => fetchZoomLinks());
  };

  if (!cls) {
    return (
      <div className="p-6 text-gray-500">
        <div className="max-w-7xl mx-auto">
          Loading class...
        </div>        
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-row space-x-2">
          <img 
              src={cls.imageUrl} 
              alt="Image" 
              className="w-15 h-15 rounded-full border-2 border-accent object-cover shadow-md"
          />                    
        <div>
          <h1 className="text-2xl font-bold">{cls.name}</h1>
          <p className="text-gray-600">{cls.subject?.name} • Grade {cls.grade}</p>
        </div>
        </div>
        
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:border-b sm:mb-4 border-r sm:border-r-0 mb-4">
        {["requests","assignments","submissions","materials","announcements","attendance","students","zoomlinks"].map((t) => (
          <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </TabButton>
        ))}
      </div>

      {/* --------- Requests --------- */}
      {tab === "requests" && (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Pending Join Requests</h3>
          {requests.length === 0 ? (
            <div className="text-gray-500">No requests</div>
          ) : (
            <ul className="divide-y">
              {requests.map((r) => (
                <li key={r._id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-gray-600">{r.email}</div>
                  </div>
                  <div className="space-x-1">
                    <button
                      onClick={() => approveRequest(r._id)}
                      className="px-4 py-2 bg-[#037c6e] text-white rounded-lg hover:bg-[#025043] cursor-pointer"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => removeRequest(r._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --------- Assignments --------- */}
      {tab === "assignments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={createAssignment} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Create Assignment</h3>
            <input
              className="w-full border rounded p-2 mb-2"
              placeholder="Title"
              value={newAsg.title}
              onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Instructions"
              value={newAsg.instructions}
              onChange={(e) => setNewAsg({ ...newAsg, instructions: e.target.value })}
            />
            <label className="text-sm text-gray-600">Due date/time</label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2 mb-3"
              value={newAsg.dueAt}
              onChange={(e) => setNewAsg({ ...newAsg, dueAt: e.target.value })}
            />
            <input 
              type="file" 
              name="attachment" 
              onChange={(e)=>setFile(e.target.files)} 
              placeholder="Attachment URL" 
              className="w-full border rounded p-2 mb-3"
            />
            <button className="w-full bg-[#037c6e] text-white rounded-lg py-2 hover:bg-[#025043] cursor-pointer">
              Create
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Assignments</h3>
            {assignments.length === 0 ? (
              <div className="text-gray-500">No assignments yet</div>
            ) : (
              <ul className="divide-y">
                {assignments.map((a) => (
                  <li key={a._id} className="py-3 flex justify-between items-center">
                    {editingId === a._id ? (
                      // EDIT FORM
                      <div className="w-full">
                        <input
                          className="w-full border rounded p-2 mb-2"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                        <textarea
                          className="w-full border rounded p-2 mb-2"
                          value={editForm.instructions}
                          onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                        />
                        <input
                          type="datetime-local"
                          className="w-full border rounded p-2 mb-2"
                          value={editForm.dueAt}
                          onChange={(e) => setEditForm({ ...editForm, dueAt: e.target.value })}
                        />
                        <input 
                          type="file" 
                          name="attachment" 
                          onChange={(e)=>setFile(e.target.files)} 
                          placeholder="Attachment URL" 
                          className="w-full border rounded p-2 mb-3"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateAssignment(a._id, editForm);
                              setEditingId(null);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-2 bg-gray-400 text-white rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // NORMAL VIEW
                      <div className="flex justify-between w-full">
                        <div>
                          <div>
                            <div className="font-semibold">{a.title}</div>
                            <div className="text-sm text-gray-600">
                              Due: {new Date(a.dueAt).toLocaleString()}
                            </div>
                          </div>
                          {a.attachments?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-700">Attachments:</p>
                              <ul className="ml-4 list-disc text-sm">
                                {a.attachments.map((url, idx) => (
                                  <li key={idx}>
                                    <a
                                      href={url}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Download File {idx + 1}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>


                        <div className=" flex items-center space-x-2">
                          <button
                            onClick={() => openSubmissions(a)}
                            className="px-3 py-2 bg-gray-800 text-white rounded-lg cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(a._id);
                              setEditForm({
                                title: a.title,
                                instructions: a.instructions,
                                dueAt: a.dueAt?.slice(0, 16),
                              });
                            }}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAssignment(a._id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  
                ))}
              </ul>

            )}
          </div>
        </div>
      )}

      {/* --------- Submissions (for selected assignment) --------- */}
      {tab === "submissions" && (
        <div className="bg-white rounded-xl shadow p-4">
          {!selectedAssignment ? (
            <div className="text-gray-500">Select an assignment from the Assignments tab</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedAssignment.title}</h3>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(selectedAssignment.dueAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setTab("assignments")}
                  className="px-3 py-2 border rounded-lg cursor-pointer"
                >
                  Back
                </button>
              </div>

              {subs.length === 0 ? (
                <div className="text-gray-500">No submissions yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Student</th>
                        <th className="text-left p-2">Submitted</th>
                        <th className="text-left p-2">Files</th>
                        <th className="text-left p-2">Score</th>
                        <th className="text-left p-2">Feedback</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map((s) => (
                        <SubmissionRow key={s._id} s={s} onGrade={gradeOne} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* --------- Materials --------- */}
      {tab === "materials" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={addMaterial} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Add Material</h3>
            <input
              className="w-full border rounded p-2 mb-2"
              placeholder="Title"
              value={newMat.title}
              onChange={(e) => setNewMat({ ...newMat, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Description"
              value={newMat.description}
              onChange={(e) => setNewMat({ ...newMat, description: e.target.value })}
            />
            <input 
              type="file" 
              name="matFile" 
              onChange={(e)=>setMatFile(e.target.files)} 
              placeholder="File URL" 
              className="w-full border rounded p-2 mb-3"
            />
            <button className="w-full bg-[#037c6e] text-white rounded-lg py-2 hover:bg-[#025043] cursor-pointer">
              Save
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Materials</h3>
            {materials.length === 0 ? (
              <div className="text-gray-500">No materials yet</div>
            ) : (
              <ul className="divide-y">
                {materials.map((m) => (
                  <li key={m._id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-sm text-gray-600">{m.description}</div>
                      {m.fileUrl && (
                        <a href={m.fileUrl} target="_blank" className="text-blue-600 underline">
                          Open file
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeMaterial(m._id)}
                      className="px-3 py-2 text-white rounded-lg cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* --------- Announcements --------- */}
      {tab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={addAnnouncement} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Post Announcement</h3>
            <input
              className="w-full border rounded p-2 mb-2"
              placeholder="Title"
              value={newAnn.title}
              onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded p-2 mb-3"
              placeholder="Message"
              value={newAnn.message}
              onChange={(e) => setNewAnn({ ...newAnn, message: e.target.value })}
            />
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={newAnn.pinned}
                onChange={(e) => setNewAnn({ ...newAnn, pinned: e.target.checked })}
              />
              Pin to top
            </label>
            <button className="w-full bg-[#037c6e] text-white rounded-lg py-2 hover:bg-[#025043] cursor-pointer">
              Post
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Announcements</h3>
            {ann.length === 0 ? (
              <div className="text-gray-500">No announcements</div>
            ) : (
              <ul className="divide-y">
                {ann.map((a) => (
                  <li key={a._id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {a.title} {a.pinned && <span className="text-xs text-orange-600">(pinned)</span>}
                      </div>
                      <div className="text-gray-700">{a.message}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePin(a._id, a.pinned)}
                        className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-700 text-white cursor-pointer"
                      >
                        {a.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => deleteAnn(a._id)}
                        className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* --------- Attendance --------- */}
      {tab === "attendance" && (
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <label className="block text-sm text-gray-600">Date</label>
              <input
                type="date"
                className="border rounded p-2"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={loadAttendance} className="px-4 py-2 border rounded-lg cursor-pointer">
                Load
              </button>
              <button
                onClick={saveAttendance}
                className="px-4 py-2 bg-[#037c6e] text-white rounded-lg cursor-pointer hover:bg-[#025043]"
              >
                Save
              </button>
            </div>
          </div>

          {(attEntries || []).length === 0 ? (
            <div className="text-gray-500">No students enrolled.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {attEntries.map((e, idx) => (
                    <tr key={e.student} className="border-b">
                      <td className="p-2">{e.name}</td>
                      <td className="p-2">
                        <select
                          className="border rounded p-2"
                          value={e.status}
                          onChange={(ev) => {
                            const copy = [...attEntries];
                            copy[idx].status = ev.target.value;
                            setAttEntries(copy);
                          }}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          className="border rounded p-2 w-full"
                          value={e.note}
                          onChange={(ev) => {
                            const copy = [...attEntries];
                            copy[idx].note = ev.target.value;
                            setAttEntries(copy);
                          }}
                          placeholder="Optional note"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --------- Zoom Links --------- */}
      {tab === "zoomlinks" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* form */}
          <form onSubmit={saveZoomLink} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Add / Update Zoom Link</h3>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded p-2 mb-2"
              value={newZoom.date}
              onChange={(e) => setNewZoom({ ...newZoom, date: e.target.value })}
            />
            <input
              className="w-full border rounded p-2 mb-3"
              placeholder="Zoom Link"
              value={newZoom.zoomLink}
              onChange={(e) => setNewZoom({ ...newZoom, zoomLink: e.target.value })}
            />
            <button className="w-full bg-[#037c6e] text-white rounded-lg py-2 hover:bg-[#025043] cursor-pointer">
              Save
            </button>
          </form>

          {/* list */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Zoom Links</h3>
            {zoomLinks.length === 0 ? (
              <div className="text-gray-500">No links added yet</div>
            ) : (
              <ul className="divide-y">
                {zoomLinks.map((z) => (
                  <li key={z._id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {new Date(z.date).toLocaleDateString()}
                      </div>
                      <a
                        href={z.zoomLink}
                        target="_blank"
                        className="text-blue-600 underline"
                        rel="noopener noreferrer"
                      >
                        {z.zoomLink}
                      </a>
                    </div>
                    <div className="flex gap-2 mr-2">
                      {["upcoming", "ongoing", "completed"].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeStatus(z._id, s)}
                            className={`px-2 py-1 rounded cursor-pointer ${
                              z.status === s
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                    </div>                    
                    <div className="flex gap-2">
                      
                      <button
                        onClick={() => setNewZoom({ date: z.date.slice(0,10), zoomLink: z.zoomLink })}
                        className="px-2 py-1  bg-orange-500 hover:bg-orange-700 text-white rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteZoomLink(z._id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                      
                    </div>
                    
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}


      {/* --------- Students --------- */}
      {tab === "students" && (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Enrolled Students</h3>
          {(!cls.students || cls.students.length === 0) ? (
            <div className="text-gray-500">No students enrolled.</div>
          ) : (
            <ul className="divide-y">
              {cls.students.map((s) => (
                <li key={s._id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-600">{s.email}</div>
                  </div>
                  <button
                    onClick={() => removeStudent(s._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
    </div>
  );
}

function SubmissionRow({ s, onGrade }) {
  const [score, setScore] = useState(s.grade?.score ?? "");
  const [feedback, setFeedback] = useState(s.grade?.feedback ?? "");

  return (
    <tr className="border-b">
      <td className="p-2">
        <div className="font-medium">{s.student?.name}</div>
        <div className="text-sm text-gray-600">{s.student?.email}</div>
      </td>
      <td className="p-2">{new Date(s.submittedAt).toLocaleString()}</td>
      <td className="p-2">
        {s.files?.length ? (
          <div className="flex flex-col gap-1">
            {s.files.map((f, i) => (
              <a key={i} href={f} target="_blank" className="text-blue-600 underline">
                File {i + 1}
              </a>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        )}
        {s.textAnswer && <div className="text-sm mt-1">“{s.textAnswer}”</div>}
      </td>
      <td className="p-2">
        <input
          className="border rounded p-2 w-24"
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </td>
      <td className="p-2">
        <input
          className="border rounded p-2 w-56"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
        />
      </td>
      <td className="p-2">
        <button
          onClick={() => onGrade(s._id, Number(score), feedback)}
          className="px-3 py-2 bg-[#037c6e] text-white rounded-lg hover:bg-[#025043] cursor-pointer"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
