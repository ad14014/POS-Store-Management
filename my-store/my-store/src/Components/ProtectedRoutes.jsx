import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("Profile");

    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u)); // parse if JSON
      } catch {
        setUser(u); // fallback if plain string
      }
    }

    setLoading(false); // ✅ done checking
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  return user && token ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoutes;
