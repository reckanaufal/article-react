import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/article/${id}`);
      if (!response.ok) throw new Error("Gagal mengambil artikel");
      const data = await response.json();
      if (data) setPost(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/article/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, status }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan perubahan");
      setPost({ ...post, status });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>Edit Post</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="success"
          className="me-2"
          onClick={() => handleSubmit("publish")}
          disabled={loading}
        >
          {loading ? "Saving..." : "Publish"}
        </Button>
        <Button
          variant="warning"
          className="me-2"
          onClick={() => handleSubmit("draft")}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back
        </Button>
      </Form>
    </div>
  );
}
