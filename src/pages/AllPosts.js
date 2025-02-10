import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Nav, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AllPosts() {
  const [activeTab, setActiveTab] = useState("publish");
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(23);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    fetchArticles(true);
  }, [activeTab]);

  const fetchArticles = async (reset = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/articles/${limit}/${reset ? 0 : offset}`
      );
      if (!response.ok) throw new Error("Gagal mengambil data");
      const data = await response.json();
      setPosts((prevPosts) => (reset ? data : [...prevPosts, ...data]));
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const filteredPosts = posts.filter((post) => post.status === activeTab);

  const moveToTrash = (id) => {
    if (window.confirm("Apakah Anda yakin ingin memindahkan ke trash?")) {
      setPosts(posts.map((post) => 
        post.id === id ? { ...post, status: "trash" } : post
      ));
      setActiveTab("trash");
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Posts</h2>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Nav.Item>
          <Nav.Link eventKey="publish">Published</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="draft">Drafts</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="trash">Trashed</Nav.Link>
        </Nav.Item>
      </Nav>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>
                  <Link to={`/edit/${post.id}`} className="btn btn-sm btn-primary me-2">
                    <FaEdit /> Edit
                  </Link>
                  {activeTab !== "trash" && (
                    <Button variant="danger" size="sm" onClick={() => moveToTrash(post.id)}>
                      <FaTrash /> Trash
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No posts found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="text-center mt-3">
        <Button variant="secondary" onClick={() => fetchArticles()} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
}
