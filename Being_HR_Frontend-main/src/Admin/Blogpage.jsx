import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Blogpage.css';

// Helper: strip HTML tags if content has HTML
const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const Blogpage = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null); // for modal
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axios.get('http://localhost:5000/check-admin', { withCredentials: true });
                if (!res.data.isAdmin) {
                    navigate('/'); // redirect if not admin
                } else {
                    fetchBlogs();
                }
            } catch (error) {
                console.error('Error checking admin:', error);
                navigate('/'); // redirect on error
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/blog');
            setBlogs(res.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/admin/approveblog/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error approving blog:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const truncateContent = (content) => {
        const plainText = stripHtml(content);
        const maxLength = 120;
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-blogs">
            <h2>Admin Blogs Management</h2>
            <div className="blogs-list">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-card">
                        <h3>{blog.title}</h3>
                        <p><strong>Author:</strong> {blog.author}</p>
                        <p><strong>Date:</strong> {formatDate(blog.date)}</p>
                        <p>{truncateContent(blog.content)}</p>
                        <p>
                            Status:{' '}
                            {blog.isApprove ? (
                                <span className="status-approved">✔ Approved</span>
                            ) : (
                                <span className="status-pending">⏳ Pending</span>
                            )}
                        </p>

                        <div className="buttons">
                            <button onClick={() => setSelectedBlog(blog)}>View</button>
                            {!blog.isApprove && (
                                <button onClick={() => handleApprove(blog._id)}>Approve</button>
                            )}
                            <button onClick={() => handleDelete(blog._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for full content */}
            {selectedBlog && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{selectedBlog.title}</h3>
                        <p><strong>Author:</strong> {selectedBlog.author}</p>
                        <p><strong>Date:</strong> {formatDate(selectedBlog.date)}</p>
                        <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                        <button onClick={() => setSelectedBlog(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blogpage;
