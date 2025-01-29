import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Header from "./layouts/Header";
import SearchPane from "./features/search/SearchPane";
import MapPane from "./features/map/MapPane";
import ListingsPane from "./features/listings/ListingsPane";
import { Login } from "./features/auth/Login";
import { Register } from "./features/auth/Register";
import { RentSubmissionForm } from "./features/submissions/RentSubmissionForm";
import { PropertyListingForm } from "./features/listings/PropertyListingForm";
import "./App.css";

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function MainLayout() {
  return (
    <div className="App">
      <Header />
      <SearchPane />
      <div id="container">
        <MapPane />
        <ListingsPane />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Main page accessible to everyone */}
          <Route path="/" element={<MainLayout />} />
          {/* Protected routes */}
          <Route
            path="/submit-rent"
            element={
              <RequireAuth>
                <RentSubmissionForm />
              </RequireAuth>
            }
          />
          <Route
            path="/create-listing"
            element={
              <RequireAuth>
                <PropertyListingForm />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
