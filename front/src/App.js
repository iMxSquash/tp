import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './App.css';
import Home from "./pages/home";
import Detail from "./pages/detail";
import AddArticle from "./pages/add";
import Update from "./pages/update";
import Register from "./pages/register";
import Sign from "./pages/sign";
import Header from "./components/header";

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
        </Routes>
      </>
  );
}

export default App;
