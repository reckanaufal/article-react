import React, { useState, useEffect } from "react";
import { Container, Card, Pagination, Alert, Spinner, Button, Form } from "react-bootstrap";

export default function Preview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [articlesPerPage, setArticlesPerPage] = useState(3);

  useEffect(() => {
    fetchArticles(1, true);
  }, [articlesPerPage]);

  const fetchArticles = async (page, reset = false) => {
    setLoading(true);
    const offset = (page - 1) * articlesPerPage;
    try {
      const res = await fetch(`http://localhost:8080/articles/${articlesPerPage}/${offset}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      
      const publishedArticles = data.filter(article => article.status === "publish");
      setArticles(prev => (reset ? publishedArticles : [...prev, ...publishedArticles]));
      setHasMore(publishedArticles.length === articlesPerPage);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error Fetching Data', err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Published Articles</h2>

      <Form.Select 
        className="mb-3 w-auto" 
        value={articlesPerPage} 
        onChange={(e) => {
          setArticlesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value="3">3 Artikel</option>
        <option value="5">5 Artikel</option>
        <option value="10">10 Artikel</option>
      </Form.Select>

      {loading && currentPage === 1 && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && !error && articles.length === 0 && <p>Tidak ada artikel yang tersedia.</p>}

      {!loading && !error && articles.length > 0 &&
        articles.map((article) => (
          <Card key={article.id} className="mb-3">
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{article.category}</Card.Subtitle>
              <Card.Text>{article.content}</Card.Text>
            </Card.Body>
          </Card>
        ))
      }

      {!loading && !error && hasMore && (
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => fetchArticles(currentPage + 1)}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </Container>
  );
}
