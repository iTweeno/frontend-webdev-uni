import "./Navbar.css";
import { Link } from "react-router-dom";
import image from "../static/logo.png";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

const Navbar = () => {
  const { session, logout } = useSession();
  return (
    <div className="navbar">
      <Link to="/">
        <img src={image} className="logo" alt="" />
      </Link>
      <div>
        {!session.loggedIn ? (
          <div>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        ) : (
          <div className="logged_in">
            <Link to="/profile" className="logged_in_text">
              <h1>{`${session.data.first_name}'s account`}</h1>
            </Link>
            <Link to="/postListing">
              <button>Post a Listing!</button>
            </Link>
            <button onClick={() => logout().then(() => navigate("/"))}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
