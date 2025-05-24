import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../Api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check token and fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      try {
        const { data } = await API.get("/me");
        setUser(data.user);
        setPartner(data.user.partner || null);
        await fetchMessages(data.user.partner);
      } catch (err) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setPartner(data.user.partner || null);
      await fetchMessages(data.user.partner);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setPartner(data.user.partner || null);
      await fetchMessages(data.user.partner);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPartner(null);
    setMessages([]);
  };

  // Fetch messages for current partner
  const fetchMessages = async (partnerName) => {
    if (!partnerName) return;
    setLoading(true);
    try {
      // const { data } = await API.get(`/messages?partner=${partnerName}`);
      const { data } = await API.get(`/inbox`);
      setMessages(data.messages);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (message) => {
    if (!partner) return;
    try {
      const { data } = await API.post("/send", {
        // content,
        message,
        receiver: partner,
      });
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setError("Failed to send message");
    }
  };

  // Switch partner
  const switchPartner = async (newPartner) => {
    setPartner(newPartner);
    await fetchMessages(newPartner);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        setPartner: switchPartner,
        messages,
        sendMessage,
        login,
        signup,
        logout,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
