import React, { useEffect, useState } from 'react';
import './App.css';

const deleteUser = id =>
    fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE'
    }).then(() => id);

const App = () => {
    const [users, setUsers] = useState([]);
    const removeUser = id => setUsers(users.filter(user => id !== user.id));

    useEffect(() => {
        fetch('http://localhost:3001/users')
            .then(res => res.json())
            .then(setUsers);
    }, []);

    return (
        <div className="hello">
            <h1>Hello World!</h1>
            {users.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    {user.lastName}, {user.firstName}
                                </td>
                                <td>{user.email}</td>
                                <td
                                    style={{
                                        textDecoration: 'underline',
                                        color: 'royalblue',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() =>
                                        deleteUser(user.id).then(removeUser)
                                    }
                                >
                                    Delete
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default App;
