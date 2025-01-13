import { Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/home";
import Detail from "./pages/detail";
import AddArticle from "./pages/add";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/add" element={<AddArticle />} />
    </Routes>
  );
}

export default App;
