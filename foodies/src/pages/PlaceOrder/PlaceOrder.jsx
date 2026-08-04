import "./PlaceOrder.css";
import React, { useContext, useState } from "react";
import { assets } from "./../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import { calculateCartTotals } from "../../util/cartUtils.js";
import axios from "axios";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/contants.js";
import { useNavigate } from "react-router-dom";
//import Razorpay from "razorpay";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
 const navigate=useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state},${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        prices: item.prices * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/create",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201 && response.data.razorpayOrderId) {
        initiateRazorpayPayment(response.data);
      } else {
        toast.error("unable to place order. Please try again.");
      }
    } catch (error) {
      toast.error("unable to place order. Please try again.");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount ,
      currency: "INR",
      name: "Food Land",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: async function (response) {
        // await varifyPayment(razorpayResponse);
          await varifyPayment(response);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async function () {
          toast.error("payment cancelled.");
          await deleteOrder(order.id);
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const varifyPayment =async(razorpayResponse)=>{
  const paymentData = {
    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
    razorpay_order_id: razorpayResponse.razorpay_order_id,
    razorpay_signature: razorpayResponse.razorpay_signature,
  };
    try {
    const response = await axios.post(
      'http://localhost:8080/api/orders/verify',
      paymentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      toast.success('Payment successful.');
      await clearCart();
      navigate('/myorders');
    } else {
      toast.error('Payment failed. Please try again.');
      navigate('/');
    }
  } catch (error) {
    toast.error('Payment verification failed. Please try again.');
   
  }
  };
const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    toast.error("Something went wrong. Contact support.");
  }
};

const clearCart = async () => {
  try {
    await axios.delete("http://localhost:8080/api/cart/clear", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuantities({});
  } catch (error) {
    toast.error("Error while clearing the cart.");
  }
};

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities,
  );

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.parcel}
            alt="logo"
            height={98}
            width={98}
          />
        </div>

        <div className="row g-5">
          {/* Order Summary */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    &#8377;{item.prices * quantities[item.id]}
                  </span>
                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between">
                <span className="text-body-secondary">Shipping</span>
                <span className="text-body-secondary">
                  &#8377;{subtotal === 0 ? "0.00" : shipping.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Tax (10%)</span>
                <span className="text-body-secondary">
                  &#8377;{tax.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>
                <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          {/* Billing Form */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Mayur"
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Burale"
                    required
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="mayur@gmail.com"
                      required
                      name="email"
                      onChange={onChangeHandler}
                      value={data.email}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="9896202323"
                    required
                    name="phoneNumber"
                    onChange={onChangeHandler}
                    value={data.phoneNumber}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    required
                    name="address"
                    onChange={onChangeHandler}
                    value={data.address}
                  />
                </div>

              
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    id="state"
                    required
                    name="state"
                    onChange={onChangeHandler}
                    value={data.state}
                  >
                    <option value="">Choose...</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    required
                    name="city"
                    onChange={onChangeHandler}
                    value={data.city}
                  >
                    <option value="">Choose...</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Pune">Pune</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Surat">Surat</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Indore">Indore</option>
                    <option value="Thane">Thane</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Pimpri-Chinchwad">Pimpri-Chinchwad</option>
                    <option value="Patna">Patna</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Ludhiana">Ludhiana</option>
                    <option value="Agra">Agra</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Meerut">Meerut</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Srinagar">Srinagar</option>
                    <option value="Aurangabad">Aurangabad</option>
                    <option value="Dhanbad">Dhanbad</option>
                    <option value="Amritsar">Amritsar</option>
                    <option value="Allahabad">Allahabad</option>
                    <option value="Ranchi">Ranchi</option>
                    <option value="Howrah">Howrah</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Jabalpur">Jabalpur</option>
                    <option value="Gwalior">Gwalior</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Jodhpur">Jodhpur</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Raipur">Raipur</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Guwahati">Guwahati</option>
                    <option value="Solapur">Solapur</option>
                    <option value="Hubli-Dharwad">Hubli-Dharwad</option>
                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                    <option value="Bareilly">Bareilly</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Thiruvananthapuram">
                      Thiruvananthapuram
                    </option>
                    <option value="Noida">Noida</option>
                    <option value="Gurgaon">Gurgaon</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    placeholder="440023"
                    name="zip"
                    onChange={onChangeHandler}
                    value={data.zip}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
