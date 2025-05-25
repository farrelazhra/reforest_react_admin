// src/components/admin/FAQManager.jsx
import React, { useState } from "react";
import "./FAQManager.css";

const initialData = [
  { id: 1, question: "Apa itu reforest?", answer: "Reforest adalah aplikasi untuk menanam pohon." },
  { id: 2, question: "Bagaimana cara ikut program?", answer: "Daftar melalui halaman pendaftaran kami." },
  { id: 3, question: "Apakah ada biaya?", answer: "Program ini gratis untuk semua peserta." },
];

function FAQManager() {
  const [faqList, setFaqList] = useState(initialData);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return alert("Isi semua field!");

    if (editId === null) {
      const newFaq = {
        id: faqList.length > 0 ? faqList[faqList.length - 1].id + 1 : 1,
        ...formData,
      };
      setFaqList([...faqList, newFaq]);
    } else {
      setFaqList(faqList.map((faq) => (faq.id === editId ? { ...faq, ...formData } : faq)));
      setEditId(null);
    }

    setFormData({ question: "", answer: "" });
  };

  const handleEdit = (faq) => {
    setEditId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus?")) {
      setFaqList(faqList.filter((faq) => faq.id !== id));
    }
  };

  return (
    <div className="manager-container">
      <h2>Manajemen FAQ</h2>

      <form className="manager-form" onSubmit={handleSubmit}>
        <input type="text" name="question" placeholder="Pertanyaan" value={formData.question} onChange={handleChange} />
        <input type="text" name="answer" placeholder="Jawaban" value={formData.answer} onChange={handleChange} />
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
