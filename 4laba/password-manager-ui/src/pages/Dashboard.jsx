import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState(0); // 0 - все категории

  // Для паролей
  const [editingPasswordId, setEditingPasswordId] = useState(null); // null - не редактируем
  const [passwordForm, setPasswordForm] = useState({
    title: "",
    login: "",
    password_enc: "",
    url: "",
    notes: "",
    category_id: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [pwdResponse, catResponse] = await Promise.all([
        axios.get("http://192.168.1.64:8001/api/passwords/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://192.168.1.64:8001/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPasswords(pwdResponse.data);
      setCategories(catResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // --- Категории ---
  const categoriesMap = categories.reduce((map, cat) => {
    map[cat.id] = cat;
    return map;
  }, {});

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      await axios.post(
        "http://192.168.1.64:8001/api/categories/",
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategoryName("");
      fetchData();
    } catch (error) {
      alert("Failed to add category");
    }
  };

  const startEditingCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const saveEditingCategory = async () => {
    if (!editingCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      await axios.put(
        `http://192.168.1.64:8001/api/categories/${editingCategoryId}`,
        { name: editingCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cancelEditingCategory();
      fetchData();
    } catch (error) {
      alert("Failed to update category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`http://192.168.1.64:8001/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  // --- Пароли ---

  const resetPasswordForm = () => {
    setEditingPasswordId(null);
    setPasswordForm({
      title: "",
      login: "",
      password_enc: "",
      url: "",
      notes: "",
      category_id: 0,
    });
  };

  const startEditingPassword = (pwd) => {
    setEditingPasswordId(pwd.id);
    setPasswordForm({
      title: pwd.title,
      login: pwd.login,
      password_enc: pwd.password_enc,
      url: pwd.url || "",
      notes: pwd.notes || "",
      category_id: pwd.category_id || 0,
    });
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const savePassword = async () => {
    // Простая валидация
    if (!passwordForm.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!passwordForm.login.trim()) {
      alert("Login is required");
      return;
    }
    if (!passwordForm.password_enc.trim()) {
      alert("Password is required");
      return;
    }
    try {
      if (editingPasswordId === null) {
        // Добавление
        await axios.post(
          "http://192.168.1.64:8001/api/passwords/",
          passwordForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Обновление
        await axios.put(
          `http://192.168.1.64:8001/api/passwords/${editingPasswordId}`,
          passwordForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      resetPasswordForm();
      fetchData();
    } catch (error) {
      alert("Failed to save password");
    }
  };

  const deletePassword = async (id) => {
    if (!window.confirm("Delete this password?")) return;
    try {
      await axios.delete(`http://192.168.1.64:8001/api/passwords/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Если удаляем редактируемый пароль — сброс формы
      if (editingPasswordId === id) resetPasswordForm();
      fetchData();
    } catch (error) {
      alert("Failed to delete password");
    }
  };

  // Фильтрация паролей по выбранной категории (если 0 — все)
  const filteredPasswords =
    selectedCategoryId === 0
      ? passwords
      : passwords.filter((pwd) => pwd.category_id === selectedCategoryId);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Dashboard</h2>
      <p style={{ textAlign: "center", marginBottom: "32px" }}>
        Welcome to your dashboard!
      </p>

      {/* Фильтр категорий */}
      <section style={{ marginBottom: "40px" }}>
        <h3>Filter Passwords by Category</h3>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          style={{
            padding: "8px 12px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "24px",
            cursor: "pointer",
            width: "220px",
          }}
        >
          <option value={0}>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Список паролей */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: filteredPasswords.length === 0 ? "center" : "flex-start",
          }}
        >
          {filteredPasswords.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No passwords found for this category.
            </p>
          ) : (
            filteredPasswords.map((pwd) => (
              <div
                key={pwd.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  width: "260px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  transition: "transform 0.2s ease",
                  cursor: "default",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <h3 style={{ marginBottom: "12px", color: "#ff6600" }}>{pwd.title}</h3>
                <p>
                  <strong>Login:</strong> {pwd.login}
                </p>
                <p>
                  <strong>Password:</strong> {pwd.password_enc}
                </p>
                <p>
                  <strong>URL:</strong>{" "}
                  <a
                    href={pwd.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0077cc" }}
                  >
                    {pwd.url}
                  </a>
                </p>
                {pwd.notes && (
                  <p>
                    <strong>Notes:</strong> {pwd.notes}
                  </p>
                )}
                <p>
                  <strong>Category:</strong>{" "}
                  {categoriesMap[pwd.category_id]?.name || "—"}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#888",
                    marginTop: "12px",
                  }}
                >
                  Created: {new Date(pwd.created_at).toLocaleString()}
                </p>

                {/* Кнопки редактирования и удаления */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => startEditingPassword(pwd)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#007bff",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                    title="Edit password"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePassword(pwd.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                    title="Delete password"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Форма добавления / редактирования пароля */}
      <section
        style={{
          marginBottom: "40px",
          maxWidth: "600px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>{editingPasswordId === null ? "Add New Password" : "Edit Password"}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            name="title"
            placeholder="Title *"
            value={passwordForm.title}
            onChange={handlePasswordFormChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            name="login"
            placeholder="Login *"
            value={passwordForm.login}
            onChange={handlePasswordFormChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            name="password_enc"
            placeholder="Password *"
            value={passwordForm.password_enc}
            onChange={handlePasswordFormChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="url"
            name="url"
            placeholder="URL"
            value={passwordForm.url}
            onChange={handlePasswordFormChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={passwordForm.notes}
            onChange={handlePasswordFormChange}
            rows={3}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
            }}
          />
          <select
            name="category_id"
            value={passwordForm.category_id}
            onChange={handlePasswordFormChange}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <option value={0}>No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={savePassword}
              style={{
                flexGrow: 1,
                padding: "10px 0",
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "600",
                fontSize: "1.1rem",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {editingPasswordId === null ? "Add Password" : "Save Changes"}
            </button>
            {editingPasswordId !== null && (
              <button
                onClick={resetPasswordForm}
                style={{
                  flexGrow: 1,
                  padding: "10px 0",
                  backgroundColor: "#6c757d",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Управление категориями */}
      <section
        style={{
          marginBottom: "40px",
          maxWidth: "600px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#fff7e6",
        }}
      >
        <h3>Manage Categories</h3>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={handleAddCategory}
            style={{
              padding: "8px 20px",
              backgroundColor: "#ff6600",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Add Category
          </button>
        </div>

        {categories.length === 0 && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No categories yet.
          </p>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            {editingCategoryId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
                <button
                  onClick={saveEditingCategory}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEditingCategory}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ flexGrow: 1 }}>{cat.name}</span>
                <button
                  onClick={() => startEditingCategory(cat)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
