import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";

export default function AddNew() {
  const [article, setArticle] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const [loding, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = (status) => {
    setLoading(true);
    setError("");

    const newArticle = { ...article, status };
    
    fetch("http://localhost:8080/article", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(newArticle),
    })
    .then(async(res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData.error)+".");
      }
      return res.json();
    })
    .then((data) => {
      alert(`Artikel berhasil disimpan sebagai ${status.toUpperCase()}`);
      setLoading(false);

      setArticle({
        title: "",
        content: "",
        category: "",
        status: "draft",
      });
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    })
  };

  return (
    <Container>
      <h2 className="mb-4">Add New Article</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Enter title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={article.content}
            onChange={handleChange}
            rows={5}
            placeholder="Write content here..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={article.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </Form.Group>

        <Button
          variant="success"
          className="me-2"
          onClick={() => handleSubmit("publish")}
          disabled={loding}
        >
          {loding ? "Publishing..." : "Publish"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSubmit("draft")}
          disabled={loding}
        >
          {loding ? "Saving..." : "Save as Draft"}
        </Button>
      </Form>
    </Container>
  );
}
