
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load post");
        }

        return data;
      })
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <main className="post-details-page">
        <p role="alert">{error}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    );
  }

  if (!post) {
    return <main className="post-details-page">Loading post...</main>;
  }

  return (
    <main className="post-details-page">
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {post.tags?.length > 0 && (
        <p>Tags: {post.tags.join(", ")}</p>
      )}

      <Link to="/dashboard">Back to Dashboard</Link>
    </main>
  );
}

export default PostDetails;
