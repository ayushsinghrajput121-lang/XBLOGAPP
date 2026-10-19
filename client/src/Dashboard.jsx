
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/me/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Unable to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Failed to delete post");
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
      setError("");
    } catch (err) {
      setError("Could not connect to the backend.");
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Posts</h1>

        <Link className="create-post-button" to="/create">
          + Create Post
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}

      <section className="posts-list">
        {posts.map((post) => (
          <article className="post-card" key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <div className="post-actions">
              <button
                type="button"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                View
              </button>

              <button
                type="button"
                onClick={() => navigate(`/edit/${post._id}`)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
