import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const ADMIN_PASSWORD = "lithos123";

const Dashboard = () => {
  const [authPassed, setAuthPassed] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([
    { item: "Coca", price: "15" },
    { item: "Sprite", price: "25" },
    { item: "Pizza", price: "150" },
    { item: "Mojhito", price: "50" },
  ]);

  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  // await addDoc(collection(db, "menu"), {
  //   item: "Coca",
  //   price: "15",
  //   timestamp: serverTimestamp()
  // });
  

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orderList = [];
      querySnapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() });
      });
      setOrders(orderList);
    });
    return () => unsubscribe();
  }, []);

  const handlePasswordCheck = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setAuthPassed(true);
    } else {
      alert("Incorrect admin password");
    }
  };

  // const handleAdd = () => {
  //   if (!item || !price) return alert("Fill all fields");
  //   const newItem = { item, price };
  //   setMenu([...menu, newItem]);
  //   setItem("");
  //   setPrice("");
  //   alert("Menu item added!");
  // };

  const handleAdd = async () => {
    if (!item || !price) return alert("Fill all fields");
  
    const newItem = { item, price };
    try {
      await addDoc(collection(db, "menu"), {
        ...newItem,
        timestamp: serverTimestamp(),
      });
      setItem("");
      setPrice("");
      alert("Menu item added!");
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
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

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    console.log("status")
  };

  // const downloadExcel = () => {
  //   const excelData = orders.map((order) => ({
  //     Table: order.tableId,
  //     Total: `€${order.total.toFixed(2)}`,
  //     Status: order.status || "Pending",
  //     Items: order.order.map((i) => `${i.item} (x${i.qty})`).join(", "),
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(excelData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  //   XLSX.writeFile(workbook, "orders.xlsx");
  // };


  const downloadExcel = async () => {
    const excelData = orders.map((order) => ({
      Table: order.tableId,
      Total: `€${order.total.toFixed(2)}`,
      Status: order.status || "Pending",
      Items: order.order.map((i) => `${i.item} (x${i.qty})`).join(", "),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  
    // Delete orders from Firestore
    try {
      const deletePromises = orders.map((order) => {
        const orderRef = doc(db, "orders", order.id);
        return updateDoc(orderRef, { deleted: true }); // Optional: Mark deleted
        // or: return deleteDoc(orderRef); // to completely delete
      });
  
      await Promise.all(deletePromises);
      alert("Excel downloaded and all orders removed.");
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert("Failed to delete some orders.");
    } lithos123
  };
  

  if (!authPassed) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow rounded mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Admin Login</h2>
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
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
        >
          View Orders
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 rounded ${activeTab === "menu" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
        >
          Add Menu
        </button>
      </div>

      {/* View Orders */}
      {activeTab === "orders" && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Today's Orders</h3>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders yet</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="p-4 border-b">
                  <p>Table: {order.tableId}</p>
                  <ul className="text-sm mb-2">
                    {order.order.map((item, index) => (
                      <li key={index}>
                        {item.item} (x{item.qty}) - €{(item.price * item.qty).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold">Total: €{order.total.toFixed(2)}</p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className={`font-semibold ${order.status === "Done" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.status || "Pending"}
                    </span>
                  </p>
                  <button
                    onClick={() => handleStatusChange(order.id, order.status === "Done" ? "Pending" : "Done")}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Mark as {order.status === "Done" ? "Pending" : "Done"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {orders.length > 0 && (
            <button
              onClick={downloadExcel}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download Excel
            </button>
          )}
        </div>
      )}

      {/* Add Menu */}
      {activeTab === "menu" && (
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
