import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

interface NavbarProps {
    user: any;
    setUser: (user: any) => void;
}

const Navbar = ({ user, setUser }: NavbarProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">User Management System</Link>
            </div>

            <div className="navbar-menu">
                {user ? (
                    <>
                        <Link to="/users" className="navbar-item">Users</Link>

                        {(user.role === "admin" || user.role === "editor") && (
                            <Link to="/users/new" className="navbar-item">Add User</Link>
                        )}

                        {(user.role === "user") && (
                            <Link to="/profile" className="navbar-item">Profile</Link>
                        )}

                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-item">Login</Link>
                        <Link to="/register" className="navbar-item">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;