import React, { useState } from "react";
import "./UserManager.css";
import { Plus } from "lucide-react";

const dummyUsers = [
  {
    id: 1,
    name: "Farrel Azhra",
    email: "farrel@example.com",
    role: "Admin",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Aldo Imam",
    email: "aldo@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Muhammad Anam",
    email: "anam@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 4,
    name: "Daniel Budianto",
    email: "daniel@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 5,
    name: "Ridho Kamila",
    email: "ridho@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 6,
    name: "Panji Jumanji",
    email: "panji@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 7,
    name: "Shinta Kumala",
    email: "shinta@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 8,
    name: "Haris Luhur",
    email: "haris@example.com",
    role: "Editor",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

function UserManager() {
  const [users, setUsers] = useState(dummyUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...formData, id: u.id } : u)));
    } else {
      setUsers((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: "", email: "", role: "", image: "" });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="user-manager">
      <h2>Manajemen User</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.image} alt={user.name} />
            <div className="info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <p>
                <strong>{user.role}</strong>
              </p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)} className="delete">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingUser ? "Edit User" : "Tambah User"}</h3>
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Nama" value={formData.name} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="role" placeholder="Peran" value={formData.role} onChange={handleChange} required />
            <input name="image" placeholder="URL Gambar" value={formData.image} onChange={handleChange} />
            <button type="submit">Simpan</button>
          </form>
        </div>
      )}

      <button
        className="fab"
        onClick={() => {
          setShowForm(true);
          setEditingUser(null);
          setFormData({ name: "", email: "", role: "", image: "" });
        }}
      >
        <Plus />
      </button>
    </div>
  );
}

export default UserManager;
