
// import { useState } from "react";
// // import { collection, addDoc } from "firebase/firestore";
// // import { db } from "../firebase";
// import { Link } from "react-router-dom";

// const ADMIN_PASSWORD = "lithos123"; // 

// const Dashboard = () => {
//   const [authPassed, setAuthPassed] = useState(false);
//   const [adminInput, setAdminInput] = useState("");
//   const [item, setItem] = useState("");
//   const [price, setPrice] = useState("");

//   const handlePasswordCheck = () => {
//     if (adminInput === ADMIN_PASSWORD) {
//       setAuthPassed(true);
//     } else {
//       alert("Incorrect admin password");
//     }
//   };


//   const handleAdd = () => {
//     if (!item || !price) return alert("Fill all fields");

//     const newItem = { item, price };

//     // Get existing menu from localStorage
//     const existingItems = JSON.parse(localStorage.getItem("menu")) || [];

//     // Add new item and update localStorage
//     const updatedItems = [...existingItems, newItem];
//     localStorage.setItem("menu", JSON.stringify(updatedItems));

//     setItem("");
//     setPrice("");
//     alert("Menu item added!");
//   };


//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       {!authPassed ? (
//         <div className="bg-white p-6 rounded shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Admin Access</h2>
//           <input
//             type="password"
//             placeholder="Enter Admin Password"
//             className="w-full border p-3 mb-4 rounded"
//             value={adminInput}
//             onChange={(e) => setAdminInput(e.target.value)}
//           />
//           <button
//             onClick={handlePasswordCheck}
//             className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
//           >
//             Submit
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded shadow-md">
//           <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
//           <input
//             className="border p-2 mb-2 block w-full"
//             placeholder="Item Name"
//             value={item}
//             onChange={(e) => setItem(e.target.value)}
//           />
//           <input
//             className="border p-2 mb-4 block w-full"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <Link to="/menu">
//             <button
//               onClick={handleAdd}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Add
//             </button>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// new were updated

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const ADMIN_PASSWORD = "lithos123";

// const Dashboard = () => {
//   const [authPassed, setAuthPassed] = useState(false);
//   const [adminInput, setAdminInput] = useState("");
//   const [item, setItem] = useState("");
//   const [price, setPrice] = useState("");
//   const [menu, setMenu] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editedPrice, setEditedPrice] = useState("");

//   // Load menu items from localStorage
//   useEffect(() => {
//     const storedMenu = JSON.parse(localStorage.getItem("menu")) || [];
//     setMenu(storedMenu);
//   }, []);

//   // Save menu items to localStorage
//   const updateLocalStorage = (updatedMenu) => {
//     localStorage.setItem("menu", JSON.stringify(updatedMenu));
//     setMenu(updatedMenu);
//   };

//   const handlePasswordCheck = () => {
//     if (adminInput === ADMIN_PASSWORD) {
//       setAuthPassed(true);
//     } else {
//       alert("Incorrect admin password");
//     }
//   };

//   const handleAdd = () => {
//     if (!item || !price) return alert("Fill all fields");

//     const newItem = { item, price };
//     const updatedMenu = [...menu, newItem];
//     updateLocalStorage(updatedMenu);
//     setItem("");
//     setPrice("");
//     alert("Menu item added!");
//   };

//   const handleDelete = (index) => {
//     const updatedMenu = [...menu];
//     updatedMenu.splice(index, 1);
//     updateLocalStorage(updatedMenu);
//   };

//   const handleEdit = (index) => {
//     setEditingIndex(index);
//     setEditedPrice(menu[index].price);
//   };

//   const handleSaveEdit = (index) => {
//     const updatedMenu = [...menu];
//     updatedMenu[index].price = editedPrice;
//     updateLocalStorage(updatedMenu);
//     setEditingIndex(null);
//     setEditedPrice("");
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       {!authPassed ? (
//         <div className="bg-white p-6 rounded shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Admin Access</h2>
//           <input
//             type="password"
//             placeholder="Enter Admin Password"
//             className="w-full border p-3 mb-4 rounded"
//             value={adminInput}
//             onChange={(e) => setAdminInput(e.target.value)}
//           />
//           <button
//             onClick={handlePasswordCheck}
//             className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
//           >
//             Submit
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded shadow-md">
//           <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
//           <input
//             className="border p-2 mb-2 block w-full"
//             placeholder="Item Name"
//             value={item}
//             onChange={(e) => setItem(e.target.value)}
//           />
//           <input
//             className="border p-2 mb-4 block w-full"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
//           >
//             Add
//           </button>

//           <h2 className="text-xl font-semibold mb-3">Menu Items</h2>
//           {menu.length === 0 ? (
//             <p className="text-gray-500">No menu items available.</p>
//           ) : (
//             <ul className="space-y-4">
//               {menu.map((menuItem, index) => (
//                 <li
//                   key={index}
//                   className="border p-4 rounded flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-semibold">{menuItem.item}</p>
//                     {editingIndex === index ? (
//                       <input
//                         className="border mt-1 p-1 w-20"
//                         value={editedPrice}
//                         onChange={(e) => setEditedPrice(e.target.value)}
//                       />
//                     ) : (
//                       <p>₹ {menuItem.price}</p>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     {editingIndex === index ? (
//                       <button
//                         onClick={() => handleSaveEdit(index)}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       >
//                         Save
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleEdit(index)}
//                         className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                       >
//                         Edit
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <Link to="/menu">
//             <button className="mt-6 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
//               Go to Menu Page
//             </button>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import { useState } from "react";
import { Link } from "react-router-dom";

const ADMIN_PASSWORD = "lithos123";

const Dashboard = () => {
  const [authPassed, setAuthPassed] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  // ✅ Static menu initialized once
  const [menu, setMenu] = useState([
    { item: "Paneer Tikka", price: "180" },
    { item: "Chicken Biryani", price: "250" },
    { item: "Veg Burger", price: "120" },
  ]);

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
    const updatedMenu = [...menu, newItem];
    setMenu(updatedMenu);
    setItem("");
    setPrice("");
    alert("Menu item added!");
  };

  const handleDelete = (index) => {
    const updatedMenu = [...menu];
    updatedMenu.splice(index, 1);
    setMenu(updatedMenu);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedPrice(menu[index].price);
  };

  const handleSaveEdit = (index) => {
    const updatedMenu = [...menu];
    updatedMenu[index].price = editedPrice;
    setMenu(updatedMenu);
    setEditingIndex(null);
    setEditedPrice("");
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
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
          >
            Add
          </button>

          <h2 className="text-xl font-semibold mb-3">Menu Items</h2>
          {menu.length === 0 ? (
            <p className="text-gray-500">No menu items available.</p>
          ) : (
            <ul className="space-y-4">
              {menu.map((menuItem, index) => (
                <li
                  key={index}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{menuItem.item}</p>
                    {editingIndex === index ? (
                      <input
                        className="border mt-1 p-1 w-20"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                      />
                    ) : (
                      <p>€ {menuItem.price}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingIndex === index ? (
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link to="/menu">
            <button className="mt-6 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
              Go to Menu Page
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
