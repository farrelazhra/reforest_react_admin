// src/components/admin/FAQManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FAQManager.css";

function FAQManager() {
  const [faqList, setFaqList] = useState([]);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/faq/all");
      setFaqList(res.data.data.faq);
    } catch (error) {
      alert("Gagal mengambil data FAQ");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return alert("Isi semua field!");

    try {
      if (editId === null) {
        await axios.post("http://localhost:8000/api/faq/post", {
          ...formData,
          user_id: 1, // Sesuaikan dengan ID user login
        });
      } else {
        await axios.put(`http://localhost:8000/api/faq/update/${editId}`, {
          ...formData,
          user_id: 1,
        });
        setEditId(null);
      }

      setFormData({ question: "", answer: "" });
      fetchFaq();
    } catch (error) {
      alert("Gagal menyimpan data");
      console.error(error);
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus?")) {
      try {
        await axios.delete(`http://localhost:8000/api/faq/delete/${id}`);
        fetchFaq();
      } catch (error) {
        alert("Gagal menghapus data");
        console.error(error);
      }
    }
  };

  return (
    <div className="manager-container">
      <h2>Manajemen FAQ</h2>

      <form className="manager-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="question"
          placeholder="Pertanyaan"
          value={formData.question}
          onChange={handleChange}
        />
        <input
          type="text"
          name="answer"
          placeholder="Jawaban"
          value={formData.answer}
          onChange={handleChange}
        />
        <button type="submit">{editId === null ? "Tambah" : "Update"}</button>
        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ question: "", answer: "" });
            }}
          >
            Batal
          </button>
        )}
      </form>

      <table className="manager-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pertanyaan</th>
            <th>Jawaban</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {faqList.map((faq) => (
            <tr key={faq.id}>
              <td>{faq.id}</td>
              <td>{faq.question}</td>
              <td>{faq.answer}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(faq)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(faq.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {faqList.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Data kosong
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FAQManager;
