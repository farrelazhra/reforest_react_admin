import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./PohonManager.css";

// Custom marker icon supaya gak default icon leaflet (biar lebih keren)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // icon pohon kecil
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
  // Data dummy awal
  const [pohonList, setPohonList] = useState([
    {
      id: 1,
      nama: "Pohon Mahoni",
      jenis: "Mahoni",
      tanggal_tanam: "2024-05-01",
      lokasi: { lat: -7.7839, lng: 110.3679 },
      penanam: "Andi",
      gambar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      nama: "Pohon Jati",
      jenis: "Jati",
      tanggal_tanam: "2024-04-15",
      lokasi: { lat: -7.789, lng: 110.37 },
      penanam: "Budi",
      gambar: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=60",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPohon, setEditingPohon] = useState(null);

  // Form state
  const [form, setForm] = useState({
    nama: "",
    jenis: "",
    tanggal_tanam: "",
    lokasi: null,
    penanam: "",
    gambar: null,
    gambarPreview: null,
  });

  // Buka modal tambah
  const openAddModal = () => {
    setEditingPohon(null);
    setForm({
      nama: "",
      jenis: "",
      tanggal_tanam: "",
      lokasi: null,
      penanam: "",
      gambar: null,
      gambarPreview: null,
    });
    setModalOpen(true);
  };

  // Buka modal edit
  const openEditModal = (pohon) => {
    setEditingPohon(pohon);
    setForm({
      nama: pohon.nama,
      jenis: pohon.jenis,
      tanggal_tanam: pohon.tanggal_tanam,
      lokasi: pohon.lokasi,
      penanam: pohon.penanam,
      gambar: null,
      gambarPreview: pohon.gambar,
    });
    setModalOpen(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle gambar upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  // Simulasi save data (tambah atau update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nama || !form.jenis || !form.tanggal_tanam || !form.lokasi || !form.penanam) {
      alert("Semua field harus diisi dan lokasi harus dipilih di peta!");
      return;
    }

    if (editingPohon) {
      // Update pohon
      setPohonList((prev) =>
        prev.map((p) =>
          p.id === editingPohon.id
            ? {
                ...p,
                nama: form.nama,
                jenis: form.jenis,
                tanggal_tanam: form.tanggal_tanam,
                lokasi: form.lokasi,
                penanam: form.penanam,
                gambar: form.gambarPreview, // pakai preview untuk sementara
              }
            : p
        )
      );
    } else {
      // Tambah pohon baru
      const newPohon = {
        id: pohonList.length ? pohonList[pohonList.length - 1].id + 1 : 1,
        nama: form.nama,
        jenis: form.jenis,
        tanggal_tanam: form.tanggal_tanam,
        lokasi: form.lokasi,
        penanam: form.penanam,
        gambar: form.gambarPreview,
      };
      setPohonList((prev) => [...prev, newPohon]);
    }

    setModalOpen(false);
  };

  // Hapus pohon
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pohon ini?")) {
      setPohonList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Default image jika tidak ada
  const defaultImage = "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  return (
    <div className="pohon-manager-container">
      <h1>Manajemen Pohon</h1>

      <button className="fab" onClick={openAddModal} title="Tambah Pohon">
        +
      </button>

      <div className="pohon-list">
        {pohonList.map((pohon) => (
          <div className="pohon-item" key={pohon.id}>
            <img src={pohon.gambar || defaultImage} alt={pohon.nama} className="pohon-image" />
            <div className="pohon-info">
              <h3>{pohon.nama}</h3>
              <p>
                <b>Jenis:</b> {pohon.jenis}
              </p>
              <p>
                <b>Tanggal Tanam:</b> {new Date(pohon.tanggal_tanam).toLocaleDateString()}
              </p>
              <p>
                <b>Penanam:</b> {pohon.penanam}
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

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPohon ? "Edit Pohon" : "Tambah Pohon"}</h2>
            <form onSubmit={handleSubmit} className="form-pohon">
              <label>
                Nama Pohon:
                <input type="text" name="nama" value={form.nama} onChange={handleChange} />
              </label>
              <label>
                Jenis Pohon:
                <input type="text" name="jenis" value={form.jenis} onChange={handleChange} />
              </label>
              <label>
                Tanggal Tanam:
                <input type="date" name="tanggal_tanam" value={form.tanggal_tanam} onChange={handleChange} />
              </label>
              <label>
                Penanam:
                <input type="text" name="penanam" value={form.penanam} onChange={handleChange} />
              </label>
              <label>
                Gambar:
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              {form.gambarPreview && <img src={form.gambarPreview} alt="Preview" className="image-preview" />}

              <label>Pilih Lokasi (klik peta):</label>
              <MapContainer center={form.lokasi || { lat: -7.7839, lng: 110.3679 }} zoom={13} style={{ height: "200px", width: "100%", borderRadius: "8px" }}>
                <TileLayer attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={form.lokasi} setPosition={(pos) => setForm((f) => ({ ...f, lokasi: pos }))} />
              </MapContainer>

              <button type="submit" className="submit-btn">
                {editingPohon ? "Update" : "Tambah"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
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
