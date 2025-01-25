import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/home";
import Detail from "./pages/detail";
import AddArticle from "./pages/add";
import Update from "./pages/update";
import Register from "./pages/register";
import Sign from "./pages/sign";
import Header from "./components/header";
import Verify from "./pages/verify";
import DashboardUser from "./pages/admin/dashboard-user";
import ProtectedAdminRoute from './context/ProtectedAdminRoute';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<AddArticle />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route
          path="/admin/user"
          element={
            <ProtectedAdminRoute>
              <DashboardUser />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
