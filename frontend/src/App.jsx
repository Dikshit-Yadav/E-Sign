import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import ProtectedRoute from "./components/ProtectedRouteWrapper";
import Login from "./pages/Login";
import Home from "./pages/Home";
import OfficerHome from "./pages/OfficerHome";
import ReaderDashboard from "./pages/ReaderHome";
import CourtDetails from "./pages/CourtDetails";
import DocumentPreview from "./pages/DocumentPreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/auth/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/courts/:id" element={<CourtDetails />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
          <Route path="/officer-dashboard" element={<OfficerHome />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["reader"]} />}>
          <Route path="/reader-dashboard" element={<ReaderDashboard />} />
        </Route>

        <Route
          path="/documents/:id/preview"
          element={
            <ProtectedRoute allowedRoles={["admin", "officer", "reader"]} />
          }
        >
          <Route index element={<DocumentPreview />} />
        </Route>

        <Route path="/" element={<Navigate to="/auth/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
