import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/SignupForm";
import Login from "./components/LoginForm";
import Inbox from "./components/Inbox";
import Send from "./components/MessageSender";
import PartnershipSwitch from "./components/PartnershipSwitch";
import StoryTimeline from "./components/StoryTimeline";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/send" element={<Send />} />
          <Route path="/partner-switch" element={<PartnershipSwitch />} />
          <Route path="/story-timeline" element={<StoryTimeline />} />
          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
