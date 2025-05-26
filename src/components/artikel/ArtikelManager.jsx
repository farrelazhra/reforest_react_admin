import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ArtikelManager.css";

const defaultImage = "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const ArtikelManager = () => {
  const [artikelList, setArtikelList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentArtikel, setCurrentArtikel] = useState({
    id: null,
    title: "",
    isi: "",
    tanggal_publikasi: "",
    gambar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchArtikel = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/artikel/all");
      console.log("DATA DARI SERVER:", response.data);
      setArtikelList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data artikel:", error);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentArtikel({
      id: null,
      title: "",
      isi: "",
      tanggal_publikasi: "",
      gambar: null,
    });
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (artikel) => {
    setIsEditMode(true);
    setCurrentArtikel({
      id: artikel.id,
      title: artikel.title,
      isi: artikel.isi,
      tanggal_publikasi: artikel.tanggal_publikasi ?? "",
      // Saat edit, gambar belum tentu file, jadi kita simpan null dulu
      gambar: null,
    });
    // Preview image dari images[0].image_url jika ada
    setPreviewImage(artikel.images && artikel.images.length > 0 ? artikel.images[0].image_url : null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentArtikel({ ...currentArtikel, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCurrentArtikel({ ...currentArtikel, gambar: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSaveArtikel = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", currentArtikel.title);
    formData.append("isi", currentArtikel.isi);
    formData.append("tanggal_publikasi", currentArtikel.tanggal_publikasi);
    if (currentArtikel.gambar instanceof File) {
      formData.append("gambar", currentArtikel.gambar);
    }

    try {
      if (isEditMode) {
        await axios.post(`http://localhost:8000/api/artikel/${currentArtikel.id}?_method=PUT`, formData);
      } else {
        await axios.post("http://localhost:8000/api/artikel", formData);
      }
      fetchArtikel();
      closeModal();
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);
    }
  };

  const handleDeleteArtikel = async (id) => {
    if (window.confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        await axios.delete(`http://localhost:8000/api/artikel/${id}`);
        fetchArtikel();
      } catch (error) {
        console.error("Gagal menghapus artikel:", error);
      }
    }
  };

  return (
    <div className="artikel-admin-container">
      <h1>Manajemen Artikel</h1>
      <div className="artikel-list">
        {artikelList.length > 0 ? (
          artikelList.map((artikel) => {
            const imageUrl = artikel.images && artikel.images.length > 0 ? artikel.images[0].image_url : defaultImage;

            return (
              <div key={artikel.id} className="artikel-card">
                <img src={imageUrl} alt={artikel.title} className="artikel-image" onError={(e) => (e.target.src = defaultImage)} />
                <div className="artikel-content">
                  <h3>{artikel.title}</h3>
                  <p>{artikel.isi}</p>
                  <p className="artikel-date">{artikel.tanggal_publikasi ? new Date(artikel.tanggal_publikasi).toLocaleDateString() : "Tanggal tidak tersedia"}</p>
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
            );
          })
        ) : (
          <p>Artikel belum tersedia atau sedang dimuat...</p>
        )}
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
                Isi:
                <textarea name="isi" value={currentArtikel.isi} onChange={handleChange} required rows={4} />
              </label>
              <label>
                Tanggal Publikasi:
                <input type="date" name="tanggal_publikasi" value={currentArtikel.tanggal_publikasi} onChange={handleChange} required />
              </label>
              <label>
                Gambar:
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
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
