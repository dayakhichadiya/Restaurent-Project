import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Login from "./component/Login";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./component/ProtectedRoutes";


function App() {
  return (
    <Router basename="/">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
