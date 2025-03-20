import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../services/api";
import UserList from "../components/UserList";

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

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // Get the logged-in user's role
    const userStr = localStorage.getItem("user");
    const userRole = userStr ? JSON.parse(userStr).user.role : null;

    const fetchUsers = async (page: number, limit: number = 5) => {
        try {
            const response = await getUsers(page, limit);
            setUsers(response.data.data);
            setTotal(response.data.total);
            setPages(response.data.pages);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            {/* <Link to="/users/new">
                <button>Add User</button>
            </Link> */}
            <UserList
                users={users}
                total={total}
                page={page}
                pages={pages}
                onPageChange={(newPage) => setPage(newPage)}
                onDelete={handleDelete}
                userRole={userRole}
            />
        </div>
    );
};

export default UsersPage;