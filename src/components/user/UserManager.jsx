import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManager.css";
import { Plus } from "lucide-react";

const defaultImage = "https://via.placeholder.com/150";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    image: null,
    password: "",
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = res.data.data;
      console.log("Raw users data:", users);

      const formatted = users.map((user) => {
        let imageUrl = defaultImage;
        
        // Debug: Log individual user data
        console.log("Processing user:", user);
        console.log("User image data:", user.user_image || user.userImage);
        
        // Cek berbagai kemungkinan struktur data
        const userImageData = user.user_image || user.userImage;
        
        if (userImageData && userImageData.filename) {
          imageUrl = `http://localhost:8000/storage/images/${userImageData.filename}`;
          console.log("Generated image URL:", imageUrl);
        }
        
        return {
          id: user.id,
          username: user.username || user.name || "",
          email: user.email,
          role: user.role || "User",
          image: imageUrl,
        };
      });

      console.log("Formatted users:", formatted);
      setUsers(formatted);
    } catch (error) {
      console.error("Gagal mengambil semua user:", error);
      alert("Gagal mengambil semua user, cek console.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // buat preview
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("role", formData.role);

      if (!editingUser && formData.password.trim() === "") {
        alert("Password wajib diisi untuk user baru");
        return;
      }

      if (formData.password) {
        form.append("password", formData.password);
      }

      if (formData.image instanceof File) {
        form.append("profile_photo", formData.image);
      }

      let response;
      if (editingUser) {
        form.append("_method", "PUT");
        response = await axios.post(
          `http://localhost:8000/api/admin/users/${editingUser.id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("User berhasil diperbarui");
      } else {
        response = await axios.post("http://localhost:8000/api/admin/users", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("User berhasil ditambahkan");
      }

      console.log("Response:", response.data);
      
      fetchAllUsers();
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        role: "",
        image: null,
        password: "",
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Gagal simpan user:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      alert("Gagal simpan user, cek console.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      image: null,
      password: "",
    });

    // Set preview image
    setPreviewImage(user.image !== defaultImage ? user.image : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
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

  const handleImageError = (e, user) => {
    console.error("Image failed to load:", user.image);
    e.target.src = defaultImage;
  };

  return (
    <div className="user-manager">
      <h2>Manajemen User</h2>

      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img
              src={user.image}
              alt={user.username}
              onError={(e) => handleImageError(e, user)}
              onLoad={() => console.log("Image loaded successfully:", user.image)}
            />
            <div className="info">
              <h4>{user.username}</h4>
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
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
            />
            <input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder={editingUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
              value={formData.password}
              onChange={handleChange}
              required={!editingUser}
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />

            {/* Preview image */}
            {previewImage && (
              <div style={{ marginTop: "10px" }}>
                <p>Preview:</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "150px", borderRadius: "8px" }}
                  onError={(e) => {
                    console.error("Preview image error:", previewImage);
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <button type="submit">Simpan</button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingUser(null);
                setPreviewImage(null);
                setFormData({
                  username: "",
                  email: "",
                  role: "",
                  image: null,
                  password: "",
                });
              }}
              style={{ marginLeft: "10px" }}
            >
              Batal
            </button>
          </form>
        </div>
      )}

      <button
        className="fab"
        onClick={() => {
          setShowForm(true);
          setEditingUser(null);
          setFormData({ username: "", email: "", role: "", image: null, password: "" });
          setPreviewImage(null);
        }}
      >
        <Plus />
      </button>
    </div>
  );
}

export default UserManager;