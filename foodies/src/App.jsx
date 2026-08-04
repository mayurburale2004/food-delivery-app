import React from "react";
import Menubar from "./components/Menubar/Menubar.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ContactUs from "./pages/Contact us/ContactUs.jsx";
import ExploreFood from "./pages/ExploreFood/ExploreFood.jsx";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
 import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div>
      <Menubar />
      <ToastContainer/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order" element={<PlaceOrder/>} />
          <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      
      </Routes>
    </div>
  );
};

export default App;
