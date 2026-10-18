import EditPost from "./EditPost";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load post");
        return response.json();
      })
      .then((post) => {
        setTitle(post.title || "");
        setContent(post.content || "");
        setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error("Could not update post");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <main className="create-post-page">
      <h1>Edit Post</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          required
        />

        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Tags (comma-separated)"
        />

        <button type="submit">Update Post</button>
      </form>
    </main>
  );
}

export default EditPost;
