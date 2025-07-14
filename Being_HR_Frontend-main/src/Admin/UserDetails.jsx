import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

const DashBoard = () => {
    const [users, setUsers] = useState([]);
    const [adminLoading, setAdminLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });

                if (res.status === 401) {
                    // Not logged in
                    navigate('/login');
                    return;
                }

                const data = await res.json();
                if (!data.isAdmin) {
                    // Logged in but not admin
                    navigate('/');
                    return;
                }
            } catch (error) {
                console.error('Error checking admin:', error);
                navigate('/');
            } finally {
                setAdminLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        if (!adminLoading) {
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, { credentials: 'include' });
                    const data = await response.json();
                    setUsers(data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };

            fetchUsers();
        }
    }, [adminLoading]);

    if (adminLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-page">
            <h1>User Details</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DashBoard;
