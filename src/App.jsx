import "virtual:windi.css";
import "./App.css";
import MainPage from "./views/MainPage.jsx";
import Listings from "./views/Listings.jsx";
import Listing from "./views/Listing.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router";
import { useSession } from "./contexts/SessionContext";
import PostListing from "./views/PostListing";
import MessageOrReport from "./views/MessageOrReport";

const App = () => {
  const { session } = useSession();
  if (!session) {
    return <h1>Loading...</h1>;
  }
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/postListing" element={<PostListing />} />
            <Route path="/message" element={<MessageOrReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
