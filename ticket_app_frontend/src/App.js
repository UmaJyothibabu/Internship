import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Admin from "./components/Admin";
import Customer from "./components/Customer";
import Sidebar from "./components/Sidebar";
import BookTicket from "./components/BookTicket";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/admin" element={<Admin />} /> */}
      {/* <Route path="/customer" element={<Customer />} /> */}
      <Route path="/buyticket" element={<BookTicket />} />
      <Route path="/dashboard" element={<Sidebar />} />
    </Routes>
  );
}

export default App;
