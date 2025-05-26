import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./PohonManager.css";

const API_URL = "http://localhost:8000/api"; // Base URL API (backend API endpoint)
const BASE_URL = "http://localhost:8000"; // Base URL untuk akses gambar statis

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} icon={customIcon} />;
};

const PohonManager = () => {
  const [pohonList, setPohonList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPohon, setEditingPohon] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    jenis: "",
    tanggal_tanam: "",
    lokasi: null,
    user_id: "",
    gambar: null,
    gambarPreview: null,
  });

  useEffect(() => {
    fetchPohonList();
  }, []);

  const fetchPohonList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pohonku/all`);
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map((p) => ({
          id: p.id,
          nama: p.namaPohon,
          jenis: p.jenis_pohon,
          tanggal_tanam: p.tanggal_tanam,
          lokasi: { lat: parseFloat(p.lat), lng: parseFloat(p.long) },
          user_id: p.user_id,
          // Akses gambar dari folder storage publik Laravel tanpa /api
          gambar: p.images && p.images.length > 0 ? `${BASE_URL}/storage/images/${p.images[0].filename}` : null,
        }));
        setPohonList(formatted);
      } else {
        alert("Gagal load data pohon");
      }
    } catch (error) {
      alert("Error fetching pohon list: " + error.message);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingPohon(null);
    setForm({
      nama: "",
      jenis: "",
      tanggal_tanam: "",
      lokasi: null,
      user_id: "",
      gambar: null,
      gambarPreview: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (pohon) => {
    setEditingPohon(pohon);
    setForm({
      nama: pohon.nama,
      jenis: pohon.jenis,
      tanggal_tanam: pohon.tanggal_tanam,
      lokasi: pohon.lokasi,
      user_id: pohon.user_id,
      gambar: null,
      gambarPreview: pohon.gambar,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.jenis || !form.tanggal_tanam || !form.lokasi || !form.user_id) {
      alert("Semua field harus diisi dan lokasi harus dipilih di peta!");
      return;
    }

    const formData = new FormData();
    formData.append("namaPohon", form.nama);
    formData.append("jenis_pohon", form.jenis);
    formData.append("tanggal_tanam", form.tanggal_tanam);
    formData.append("lat", form.lokasi.lat);
    formData.append("long", form.lokasi.lng);
    formData.append("user_id", form.user_id);
    if (form.gambar) {
      formData.append("image", form.gambar);
    }

    try {
      let response;
      if (editingPohon) {
        formData.append("_method", "PUT"); // Jika backend pakai PUT lewat POST
        response = await fetch(`${API_URL}/pohonku/${editingPohon.id}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/pohonku`, {
          method: "POST",
          body: formData,
        });
      }
      const resJson = await response.json();

      if (response.ok && (resJson.status === "success" || resJson.success)) {
        alert(editingPohon ? "Update berhasil" : "Tambah berhasil");
        fetchPohonList();
        setModalOpen(false);
      } else {
        alert("Error: " + (resJson.message || "Gagal menyimpan data"));
      }
    } catch (err) {
      alert("Error submit: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pohon ini?")) return;
    try {
      const res = await fetch(`${API_URL}/pohonku/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && (data.status === "success" || data.success)) {
        alert("Berhasil menghapus pohon");
        fetchPohonList();
      } else {
        alert("Gagal menghapus pohon");
      }
    } catch (error) {
      alert("Error hapus: " + error.message);
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  return (
    <div className="pohon-manager-container">
      <h1>Manajemen Pohon</h1>

      <button className="fab" onClick={openAddModal} title="Tambah Pohon">
        +
      </button>

      {loading ? (
        <p>Loading data pohon...</p>
      ) : (
        <div className="pohon-list">
          {pohonList.map((pohon) => (
            <div className="pohon-item" key={pohon.id}>
              <img
                src={pohon.gambar || defaultImage}
                alt={pohon.nama}
                className="pohon-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <div className="pohon-info">
                <h3>{pohon.nama}</h3>
                <p>
                  <b>Jenis:</b> {pohon.jenis}
                </p>
                <p>
                  <b>Tanggal Tanam:</b> {new Date(pohon.tanggal_tanam).toLocaleDateString()}
                </p>
                <p>
                  <b>Penanam (User ID):</b> {pohon.user_id}
                </p>
                <p>
                  <b>Lokasi:</b> {pohon.lokasi.lat.toFixed(5)}, {pohon.lokasi.lng.toFixed(5)}
                </p>
              </div>
              <div className="pohon-actions">
                <button onClick={() => openEditModal(pohon)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(pohon.id)}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingPohon ? "Edit Pohon" : "Tambah Pohon"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nama Pohon:
                <input type="text" name="nama" value={form.nama} onChange={handleChange} required />
              </label>

              <label>
                Jenis Pohon:
                <input type="text" name="jenis" value={form.jenis} onChange={handleChange} required />
              </label>

              <label>
                Tanggal Tanam:
                <input type="date" name="tanggal_tanam" value={form.tanggal_tanam} onChange={handleChange} required />
              </label>

              <label>
                User ID:
                <input type="text" name="user_id" value={form.user_id} onChange={handleChange} required />
              </label>

              <label>
                Lokasi (klik pada peta):
                <MapContainer center={form.lokasi || { lat: -7.98, lng: 112.63 }} zoom={13} style={{ height: 200, width: "100%" }}>
                  <TileLayer attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={form.lokasi} setPosition={(pos) => setForm((prev) => ({ ...prev, lokasi: pos }))} />
                </MapContainer>
              </label>

              <label>
                Gambar Pohon:
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>

              {form.gambarPreview && <img src={form.gambarPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, marginTop: 10 }} />}

              <button type="submit">{editingPohon ? "Update" : "Tambah"}</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PohonManager;
