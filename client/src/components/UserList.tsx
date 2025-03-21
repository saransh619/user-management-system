import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/api";

interface Location {
    latitude: number;
    longitude: number;
}

interface User {
    _id: string;
    name: string;
    email: string;
    address: string;
    location: Location;
}

interface UserListProps {
    users: User[];
    total: number;
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
    onDelete: (userId: string) => void;
    userRole: string;
}

const UserList: React.FC<UserListProps> = ({ users, total, page, pages, onPageChange, onDelete, userRole }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchPages, setSearchPages] = useState(1);

    // Fetch all users when the search term changes
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await getUsers(1, total, searchTerm);
                setFilteredUsers(response.data.data);
                setSearchPages(Math.ceil(response.data.data.length / 5));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (searchTerm) {
            fetchAllUsers();
        } else {
            setFilteredUsers(users);
            setSearchPages(pages);
        }
    }, [searchTerm, users, total, pages]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onPageChange(1); // Reset to the first page on new search
    };

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };

    const handleEdit = (id: string) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDelete = async (userId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await onDelete(userId);
            } catch (error) {
                alert("Failed to delete user. Please try again.");
            }
        }
    };
    return (
        <div className="user-list-container">
            <h2>USERS</h2>
            <input
                type="text"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <table className="user-table">
                <thead style={{ backgroundColor: "rgb(205 205 205)" }}>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Location</th>
                        {(userRole === "admin" || userRole === "editor") && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>
                                <iframe
                                    width="100%"
                                    height="100"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${user.location.latitude},${user.location.longitude}`}
                                    title={`Map for ${user.name}`}
                                ></iframe>
                            </td>
                            {(userRole === "admin" || userRole === "editor") && (
                                <td>
                                    <button onClick={() => handleEdit(user._id)}>Edit</button>
                                    {/* Disable Delete button for editors */}
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        disabled={userRole === "editor"}
                                        style={{ opacity: userRole === "editor" ? 0.5 : 1 }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: searchPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={page === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserList;