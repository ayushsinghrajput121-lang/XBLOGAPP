
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users/me/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Posts</h1>

        <Link className="create-post-button" to="/create">
          + Create Post
        </Link>
      </div>

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
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this post?")) {
                    console.log("Delete post:", post._id);
                  }
                }}
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
