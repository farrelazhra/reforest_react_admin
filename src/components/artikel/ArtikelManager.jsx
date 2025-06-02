import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ArtikelManager.css";

const defaultImage =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const api = axios.create({
  baseURL: "http://localhost:8000/api/artikel",
});

const ArtikelManager = () => {
  const [artikelList, setArtikelList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentArtikel, setCurrentArtikel] = useState({
    id: null,
    title: "",
    isi: "",
    author: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchArtikel = async () => {
    try {
      const response = await api.get("/all");
      if (response.data.success) {
        setArtikelList(response.data.data);
      } else {
        console.error("Gagal mengambil data artikel:", response.data.message);
      }
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
      author: "",
      image: null,
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
      author: artikel.author || "",
      image: null,
    });
    setPreviewImage(
      artikel.images && artikel.images.length > 0
        ? `http://localhost:8000/storage/images/${artikel.images[0].filename}`
        : null
    );
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentArtikel({ ...currentArtikel, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCurrentArtikel({ ...currentArtikel, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSaveArtikel = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", currentArtikel.title);
    formData.append("isi", currentArtikel.isi);
    formData.append("author", currentArtikel.author);
    if (currentArtikel.image instanceof File) {
      formData.append("image", currentArtikel.image);
    }

    try {
      let res;
      if (isEditMode) {
        formData.append("_method", "PUT");
        res = await api.post(`update/${currentArtikel.id}`, formData);
      } else {
        res = await api.post("post", formData);
      }

      if (res.data.success || res.data.status === "success") {
        fetchArtikel();
        closeModal();
        alert(isEditMode ? "Berhasil mengupdate artikel" : "Berhasil menambahkan artikel");
      } else {
        alert("Gagal menyimpan artikel: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);
      alert(error.response?.data?.message || "Gagal menyimpan artikel, cek console.");
    }
  };

  const handleDeleteArtikel = async (id) => {
    if (window.confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        await api.delete(`delete/${id}`);
        fetchArtikel();
      } catch (error) {
        console.error("Gagal menghapus artikel:", error);
        alert(error.response?.data?.message || "Gagal menghapus artikel, cek console.");
      }
    }
  };

  const truncateIsi = (text) => {
    if (text.length <= 150) return text;
    return text.substring(0, 150) + "...";
  };

  return (
    <div className="artikel-admin-container">
      <h1>Manajemen Artikel</h1>
      <div className="artikel-list">
        {artikelList.length > 0 ? (
          artikelList.map((artikel) => {
            const imageUrl =
              artikel.images && artikel.images.length > 0
                ? `http://localhost:8000/storage/images/${artikel.images[0].filename}`
                : defaultImage;

            const displayDate = artikel.tanggal_publikasi || artikel.created_at;

            return (
              <div key={artikel.id} className="artikel-card">
                <img
                  src={imageUrl}
                  alt={artikel.title}
                  className="artikel-image"
                  onError={(e) => (e.target.src = defaultImage)}
                />
                <div className="artikel-content">
                  <h3>{artikel.title}</h3>
                  <p>{truncateIsi(artikel.isi)}</p>
                  <p className="artikel-date">
                    {displayDate
                      ? new Date(displayDate).toLocaleDateString()
                      : "Tanggal tidak tersedia"}
                  </p>
                  <p><strong>Author(ID USER):</strong> {artikel.author || "-"}</p>
                  <div className="artikel-actions">
                    <button onClick={() => openEditModal(artikel)} className="btn-edit">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArtikel(artikel.id)}
                      className="btn-delete"
                    >
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
                <input
                  type="text"
                  name="title"
                  value={currentArtikel.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Isi:
                <textarea
                  name="isi"
                  value={currentArtikel.isi}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </label>
              <label>
                Author(ID USER):
                <input
                  type="text"
                  name="author"
                  value={currentArtikel.author}
                  onChange={handleChange}
                  required
                />
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
