import React, { useEffect, useState } from 'react';
import './DashBoard.css';

const DashBoard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`); // Update URL if needed
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

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
                            <td colSpan="4">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DashBoard;
