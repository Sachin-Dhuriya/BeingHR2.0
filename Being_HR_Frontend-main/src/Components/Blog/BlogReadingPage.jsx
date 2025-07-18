import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BlogReadingPage.css";

const BlogReadingPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [liking, setLiking] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch blog
  const fetchBlog = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blog`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const found = data.find((item) => item._id === id && item.isApprove === true);
        setBlog(found);
      } else {
        console.error("Failed to fetch blog");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blog/${id}/comments`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  // Like handler
  const handleLike = async () => {
    if (!currentUser) return;
    setLiking(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blog/${id}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        await fetchBlog(); // Refresh like count
      } else {
        setErrorMsg(data.message || "Failed to like");
      }
    } catch (error) {
      console.error("Error liking:", error);
    } finally {
      setLiking(false);
    }
  };

  // Add comment handler
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setLoadingComment(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/blog/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          text: newComment,
          author: currentUser.name || currentUser.username || "Anonymous",
        }),
      });
      if (res.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  if (!blog) return <div>Loading blog...</div>;

  return (
    <div className="blog-reading-container">
      <h1 className="blog-reading-title">{blog.title}</h1>
      <div className="blog-reading-meta">
        <p>By {blog.author}</p>
        <span>•</span>
        <p>Published: {new Date(blog.date).toLocaleDateString()}</p>
      </div>
      <div className="blog-reading-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

      <div className="blog-like-section">
        <button onClick={handleLike} disabled={liking || !currentUser} className="like-button">
          👍 {liking ? "Liking..." : "Like"}
        </button>
        <span className="like-count">{blog.likes} {blog.likes === 1 ? "Like" : "Likes"}</span>
      </div>
      {errorMsg && <p className="like-error">{errorMsg}</p>}

      <div className="blog-comments-section">
        <h2>Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul>
            {comments.map((c) => (
              <li key={c._id}>
                <p>"{c.text}"</p>
                <small>By {c.author} • {new Date(c.date).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAddComment} className="add-comment-form">
        <p>Commenting as: <strong>{currentUser ? (currentUser.name || currentUser.username) : "..."}</strong></p>
        <textarea
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" disabled={loadingComment || !currentUser}>
          {loadingComment ? "Adding..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
};

export default BlogReadingPage;
