// Protected Route komponent - kun for loggede brugere
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  // Hvis ingen token, redirect til login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Ellers vis den beskyttede side
  return children;
}
