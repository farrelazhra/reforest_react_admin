import React, { useState, useEffect } from "react";
import "./ArtikelManager.css";

const defaultImage = "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const ArtikelManager = () => {
  const [artikelList, setArtikelList] = useState([
    {
      id: 1,
      title: "Manfaat Menanam Pohon",
      deskripsi: "Menanam pohon membantu mengurangi polusi dan menjaga keseimbangan ekosistem.",
      tanggal_publikasi: "2024-01-10",
      gambar: "",
    },
    {
      id: 2,
      title: "Pentingnya Reforestasi",
      deskripsi: "Reforestasi sangat penting untuk melawan perubahan iklim dan mengembalikan habitat.",
      tanggal_publikasi: "2024-02-15",
      gambar: "",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentArtikel, setCurrentArtikel] = useState({
    id: null,
    title: "",
    deskripsi: "",
    tanggal_publikasi: "",
    gambar: "",
  });

  // preview image file yang diupload, untuk tampil di form
  const [previewImage, setPreviewImage] = useState(null);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentArtikel({
      id: null,
      title: "",
      deskripsi: "",
      tanggal_publikasi: "",
      gambar: "",
    });
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (artikel) => {
    setIsEditMode(true);
    setCurrentArtikel(artikel);
    setPreviewImage(artikel.gambar || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveArtikel = (e) => {
    e.preventDefault();
    if (!currentArtikel.title || !currentArtikel.deskripsi || !currentArtikel.tanggal_publikasi) {
      alert("Mohon isi semua field kecuali gambar");
      return;
    }

    let gambarToSave = currentArtikel.gambar;

    // Jika previewImage berupa File URL (object URL) maka simpan sebagai URL string
    // (Simulasi upload, di real app ini harus upload ke server lalu dapat URL asli)
    if (previewImage && previewImage instanceof File) {
      gambarToSave = URL.createObjectURL(previewImage);
    }

    if (isEditMode) {
      setArtikelList(artikelList.map((a) => (a.id === currentArtikel.id ? { ...currentArtikel, gambar: gambarToSave } : a)));
    } else {
      const newArtikel = { ...currentArtikel, id: Date.now(), gambar: gambarToSave };
      setArtikelList([...artikelList, newArtikel]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteArtikel = (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus artikel ini?")) {
      setArtikelList(artikelList.filter((a) => a.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentArtikel({ ...currentArtikel, [name]: value });
  };

  // Handle upload gambar
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(file);
      // kita simpan nama file ke currentArtikel.gambar sementara (bisa diubah sesuai backend)
      setCurrentArtikel({ ...currentArtikel, gambar: file.name });
    }
  };

  return (
    <div className="artikel-admin-container">
      <h1>Manajemen Artikel</h1>
      <div className="artikel-list">
        {artikelList.map((artikel) => (
          <div key={artikel.id} className="artikel-card">
            <img
              src={artikel.gambar || defaultImage}
              alt={artikel.title}
              className="artikel-image"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
            <div className="artikel-content">
              <h3>{artikel.title}</h3>
              <p>{artikel.deskripsi}</p>
              <p className="artikel-date">{new Date(artikel.tanggal_publikasi).toLocaleDateString()}</p>
              <div className="artikel-actions">
                <button onClick={() => openEditModal(artikel)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDeleteArtikel(artikel.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={openAddModal}>
        +
      </button>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? "Edit Artikel" : "Tambah Artikel Baru"}</h2>
            <form onSubmit={handleSaveArtikel}>
              <label>
                Judul:
                <input type="text" name="title" value={currentArtikel.title} onChange={handleChange} required />
              </label>
              <label>
                Deskripsi:
                <textarea name="deskripsi" value={currentArtikel.deskripsi} onChange={handleChange} required rows={4} />
              </label>
              <label>
                Tanggal Publikasi:
                <input type="date" name="tanggal_publikasi" value={currentArtikel.tanggal_publikasi} onChange={handleChange} required />
              </label>
              <label>
                Gambar:
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>

              {/* Preview gambar */}
              {previewImage && (
                <img src={previewImage instanceof File ? URL.createObjectURL(previewImage) : previewImage} alt="Preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginTop: "10px", borderRadius: "8px" }} />
              )}

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Simpan
                </button>
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtikelManager;
