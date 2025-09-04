import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Tickets() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // store logged-in user
  const [users, setUsers] = useState([]); // for admin: all users
  const [showUsers, setShowUsers] = useState(false); // toggle users list

  const token = localStorage.getItem("token");

  // Fetch current user info from local storage (or decode token)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  const handleToggleUsers = async () => {
    try {
      if (!showUsers) {
        if (users.length === 0) {
          await fetchUsers();
        }
        setShowUsers(true);
      } else {
        setShowUsers(false);
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching users");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // removes the saved JWT token
    navigate("/login"); // redirects user to login page
  };

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to fetch users");
        setUsers([]);
        return;
      }

      // Enhance with local editable buffer for skills text
      setUsers((data || []).map((u) => ({
        ...u,
        skills: Array.isArray(u.skills) ? u.skills : [],
        skillsInput: Array.isArray(u.skills) ? u.skills.join(", ") : "",
      })));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Error fetching users");
    }
  };

  const handleUserFieldChange = (userId, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, [field]: value } : u))
    );
  };

  const handleUserSkillsChange = (userId, value) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, skills, skillsInput: value } : u))
    );
  };

  const saveUser = async (u) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: u.email, // immutable; used as identifier
          role: u.role,
          skills: u.skills || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }
      await fetchUsers();
      alert("User updated successfully");
    } catch (e) {
      console.error(e);
      alert("Error updating user");
    }
  };



  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <div className="flex gap-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
          </button>
          
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>

          {user?.role === "admin" && (
            <button type = "button" className="btn btn-primary" onClick={handleToggleUsers}>
              {showUsers ? "Hide Users" : "All Users"}
            </button>
          )}
        </div>
      </form>

      {/* Display all users if admin clicked button */}
      {showUsers && users.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id} className="p-3 border border-gray-700 rounded">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold">Email:</span> {u.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">Role:</label>
                    <select
                      className="select select-bordered select-sm"
                      value={u.role}
                      onChange={(e) => handleUserFieldChange(u._id, "role", e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">Skills:</label>
                    <input
                      className="input input-bordered input-sm w-full"
                      placeholder="Comma-separated skills"
                      value={u.skillsInput ?? (u.skills || []).join(", ")}
                      onChange={(e) => handleUserSkillsChange(u._id, e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <button className="btn btn-sm btn-primary" onClick={() => saveUser(u)}>
                      Save
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            className="card shadow-md p-4 bg-gray-800"
            to={`/tickets/${ticket._id}`}
          >
            <h3 className="font-bold text-lg">{ticket.title}</h3>
            <p className="text-sm">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {tickets.length === 0 && <p>No tickets submitted yet.</p>}
      </div>
    </div>
  );
}