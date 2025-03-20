import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
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
}

const RegisterPage = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const initialData = {
        name: "",
        email: "",
        password: "",
        address: "",
        location: { latitude: 0, longitude: 0 },
    };

    const handleSubmit = async (userData: UserData) => {
        setError("");
        try {
            await register(userData);
            navigate("/users");
        } catch (error: any) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            {/* <h2>Register New Account</h2> */}
            {error && <div className="error-message">{error}</div>}

            <UserForm
                onSubmit={handleSubmit}
                initialData={initialData}
                isEditMode={false}
                formTitle="Register Account"
            />

            <p className="form-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;