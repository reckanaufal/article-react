import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AllPosts from "./pages/AllPosts";
import AddNew from "./pages/AddNew";
import Preview from "./pages/Preview";
import EditPost from "./pages/EditPost";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Article Manager</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">All Posts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-new">Add New</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/preview">Preview</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<AllPosts />} />
          <Route path="/add-new" element={<AddNew />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
}
