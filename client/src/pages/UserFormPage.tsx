import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createUser, updateUser, getUser } from "../services/api";
import UserForm from "../components/UserForm";

interface Location {
    latitude: number;
    longitude: number;
}

interface UserData {
    name: string;
    email: string;
    password: string;
    address: string;
    location: Location;
    role: string;
}

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [initialData, setInitialData] = useState<UserData>({
        name: "",
        email: "",
        password: "",
        address: "",
        location: { latitude: 0, longitude: 0 },
        role: "user",
    });

    // Get user role from localStorage
    const userStr = localStorage.getItem("user")
    const userRole = userStr ? JSON.parse(userStr).user.role : null;

    useEffect(() => {
        if (id) {
            getUser(id)
                .then((response) => {
                    setInitialData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        } else {
            setInitialData({
                name: "",
                email: "",
                password: "",
                address: "",
                location: { latitude: 0, longitude: 0 },
                role: "user",
            });
        }
    }, [id]);

    const handleSubmit = async (userData: UserData) => {
        if (id) {
            await updateUser(id, userData);
        } else {
            await createUser(userData);
        }
        navigate("/users");
    };

    return (
        <div>
            <UserForm
                onSubmit={handleSubmit}
                initialData={initialData}
                isEditMode={isEditMode}
                userRole={userRole}
            />
        </div>
    );
};

export default UserFormPage;