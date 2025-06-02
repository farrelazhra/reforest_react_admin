import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManager.css";
import { Plus } from "lucide-react";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    image: "",
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = res.data.data;

      const formatted = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "User",
        image: user.user_image
          ? `http://localhost:8000/storage/images/${user.user_image.filename}`
          : "https://via.placeholder.com/150",
      }));

      setUsers(formatted);
    } catch (error) {
      console.error("Gagal mengambil semua user:", error);
      alert("Gagal mengambil semua user");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser) {
      alert("Fitur tambah user belum tersedia. Hanya edit user.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("role", formData.role);
      if (formData.image) {
        form.append("profile_photo", formData.image); // opsional jika API support upload image
      }

      await axios.post(
        `http://localhost:8000/api/users/update/${editingUser.id}?_method=PUT`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("User berhasil diperbarui");
      fetchAllUsers();
      setShowForm(false);
    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal update user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      image: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User berhasil dihapus");
      fetchAllUsers();
    } catch (error) {
      console.error("Gagal hapus:", error);
      alert("Gagal hapus user");
    }
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
            <input
              name="name"
              placeholder="Nama"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
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
