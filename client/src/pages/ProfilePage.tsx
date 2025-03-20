import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, deleteUser, updateUser } from "../services/api";
import UserForm from "../components/UserForm";

interface UserData {
    _id: string;
    name: string;
    email: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    role: string;
}

interface ProfilePageProps {
    setUser: (user: any) => void;
}

const ProfilePage = ({ setUser }: ProfilePageProps) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userStr = localStorage.getItem("user");
                const userId = userStr ? JSON.parse(userStr).user._id : null;
                if (userId) {
                    const response = await getUser(userId);
                    setUserData(response.data.data);
                } else {
                    console.error("User ID not found in localStorage");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? You will be logged out, and you cannot access your account after deletion."
        );

        if (confirmDelete) {
            try {
                const userStr = localStorage.getItem("user");
                const userId = userStr ? JSON.parse(userStr).user._id : null;

                if (userId) {
                    await deleteUser(userId);
                    localStorage.removeItem("user");
                    setUser(null);
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleSubmit = async (data: UserData) => {
        try {
            const userStr = localStorage.getItem("user");
            const userId = userStr ? JSON.parse(userStr).user._id : null;

            if (userId) {
                await updateUser(userId, data);
                setIsEditMode(false);
                const response = await getUser(userId);
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <h1>Welcome, {userData.name}</h1>

            {isEditMode ? (
                <UserForm
                    onSubmit={handleSubmit}
                    initialData={{ data: userData }}
                    isEditMode={true}
                    userRole={userData.role}
                />
            ) : (
                <div className="user-details">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                    <p>
                        <strong>Location:</strong> {userData.location.latitude}, {userData.location.longitude}
                    </p>

                    {/* Display map for user location */}
                    <div className="map-container" >
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_API_KEY}&q=${userData.location.latitude},${userData.location.longitude}`}
                            title={`Map for ${userData.name}`}
                        ></iframe>
                    </div>

                    <div className="actions">
                        <button onClick={handleEdit} className="edit-btn">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="delete-btn">
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;