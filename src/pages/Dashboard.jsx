
import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase";
import { Link } from "react-router-dom";

const ADMIN_PASSWORD = "lithos123"; // 

const Dashboard = () => {
  const [authPassed, setAuthPassed] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");

  const handlePasswordCheck = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setAuthPassed(true);
    } else {
      alert("Incorrect admin password");
    }
  };


  const handleAdd = () => {
    if (!item || !price) return alert("Fill all fields");

    const newItem = { item, price };

    // Get existing menu from localStorage
    const existingItems = JSON.parse(localStorage.getItem("menu")) || [];

    // Add new item and update localStorage
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem("menu", JSON.stringify(updatedItems));

    setItem("");
    setPrice("");
    alert("Menu item added!");
  };


  return (
    <div className="p-6 max-w-xl mx-auto">
      {!authPassed ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full border p-3 mb-4 rounded"
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
          />
          <button
            onClick={handlePasswordCheck}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
          <input
            className="border p-2 mb-2 block w-full"
            placeholder="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <input
            className="border p-2 mb-4 block w-full"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Link to="/menu">
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
