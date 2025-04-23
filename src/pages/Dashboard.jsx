import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
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
  where,
  serverTimestamp,
  deleteDoc,
  getDocs, Timestamp
} from "firebase/firestore";
import * as XLSX from "xlsx";

const ADMIN_PASSWORD = "lithos123";

const Dashboard = () => {
  const [authPassed, setAuthPassed] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);

  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");



  useEffect(() => {
    // localStorage.clear();
  }, []);


  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );

    const todayOnlyQuery = query(
      collection(db, "orders"),
      where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(todayOnlyQuery, (querySnapshot) => {
      const orderList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.deleted && data.status !== "Done") {
          orderList.push({ id: doc.id, ...data });
        }
      });
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchMenu = async () => {
      const menuQuery = query(collection(db, "menu"));
      const querySnapshot = await getDocs(menuQuery);
      const menuList = [];
      querySnapshot.forEach((docSnap) => {
        menuList.push({ id: docSnap.id, ...docSnap.data() });
      });
      console.log("Manual fetch menu:", menuList);
      setMenu(menuList);
    };
    fetchMenu();
  }, []);

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };
  <input
    onKeyDown={(e) => handleKeyPress(e, handleAdd)}
  />


  const handlePrint = async (order) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    const receiptNumber = order.id.slice(-6).toUpperCase();


    const printContent = `
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                padding: 20px;
                width: 320px;
                margin: auto;
                background-color: #fff;
                color: #000;
              }
              .receipt {
                border: 1px solid #000;
                padding: 20px;
                box-shadow: 0 0 5px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .header p {
                margin: 0;
                font-size: 12px;
              }
              .meta {
                font-size: 12px;
                margin-bottom: 10px;
              }
              .line {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }
              .items div {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 4px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>LITHOS GRILL & BAR</h1>
                <p>Oroklini, Larnaca, Cyprus</p>
                <p>Phone: 97868418</p>
              </div>
              <div class="meta">
                <p><strong>Receipt #:</strong> ${receiptNumber}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
                <p><strong>Table:</strong> ${order.tableId}</p>
              </div>
              <div class="line"></div>
              <div class="items">
                ${order.order.map(
      (item) => `
                  <div>
                    <span>${item.item} x${item.qty}</span>
                    <span>€${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                `
    ).join("")}
              </div>
              <div class="line"></div>
              <div class="items">
                <div><strong>Subtotal</strong><span>€${order.total.toFixed(2)}</span></div>
                <div><strong>Tax (5%)</strong><span>€${(order.total * 0.05).toFixed(2)}</span></div>
                <div><strong>Total</strong><span><strong>€${(order.total * 1.05).toFixed(2)}</strong></span></div>
              </div>
              <div class="footer">
                <p>Thank you for dining with us!</p>
                <p>Visit Again 😊</p>
              </div>
            </div>
          </body>
        </html>
      `;
    toast.loading("Printing receipt...");
    const printWindow = window.open("", "_blank", "width=600,height=700");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    toast.dismiss(); // clear loading
    // toast.success("Receipt printed and marked as done!");

    const orderRef = doc(db, "orders", order.id);
    await updateDoc(orderRef, { printed: true });
    toast.success("Receipt printed and marked as done!");
  };



  const handlePasswordCheck = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setAuthPassed(true);
    } else {
      // alert("Incorrect admin password");
      toast.error("Incorrect admin password!");
      setAdminInput("");
    }
  };

  const handleAdd = async () => {
    if (!item || !price) return toast.error("Please enter both item and price");
    if (isNaN(price)) return toast.error("Price must be a number");
    try {
      await addDoc(collection(db, "menu"), {
        item,
        price,
        timestamp: serverTimestamp(),
        addedBy: "admin",
      });
      setItem("");
      setPrice("");
      toast.success("Menu item added!");
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "menu", itemId));
      toast.success("Menu item deleted!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  const handleEdit = (itemId, currentPrice) => {
    setEditingIndex(itemId);
    setEditedPrice(currentPrice);
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const itemRef = doc(db, "menu", itemId);
      await updateDoc(itemRef, { price: editedPrice });
      setEditingIndex(null);
      setEditedPrice("");
      toast.success("Price updated !");
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price.");
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const downloadExcel = async () => {
    const excelData = orders.map((order) => ({
      Table: order.tableId,
      Total: `€${order.total.toFixed(2)}`,
      Status: order.printed ? "Printed" : "Pending",
      Items: order.order.map((i) => `${i.item} (x${i.qty})`).join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");

    try {
      const updatePromises = orders.map((order) => {
        const orderRef = doc(db, "orders", order.id);
        return updateDoc(orderRef, { printed: true });
      });

      await Promise.all(updatePromises);
      toast.success("Excel downloaded and orders marked as printed.");
    } catch (error) {
      console.error("Error updating orders:", error);
      toast.error("Failed to update order status.");
    }
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

      {activeTab === "orders" && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Today's Orders</h3>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders yet</p>
          ) : (
            // <ul>
            //   {orders.map((order) => (

            //     <li key={order.id} className="p-4 border-b">
            //       <p>Table: {order.tableId}</p>
            //       <ul className="text-sm mb-2">
            //         {order.order?.map((item, index) => (
            //           <li key={index}>
            //             {item.item} (x{item.qty}) - €{(item.price * item.qty).toFixed(2)}
            //           </li>
            //         ))}
            //         {order.printed ? (
            //           <span className="text-green-600">✔ Printed</span>
            //         ) : (
            //           <span className="text-red-600">⏳ Not Printed</span>
            //         )}

            //         <button
            //           onClick={() => handlePrint(order)}
            //           className="mt-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
            //         >
            //           Print Bill
            //         </button>

            //       </ul>
            //       <p className="font-bold">Total: €{order.total.toFixed(2)}</p>
            //       <p className="text-sm">
            //         Status: <span className={`font-semibold ${order.status === "Done" ? "text-green-600" : "text-yellow-600"}`}>{order.status || "Pending"}</span>
            //       </p>
            //       <button
            //         onClick={() => handleStatusChange(order.id, order.status === "Done" ? "Pending" : "Done")}
            //         className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            //       >
            //         Mark as {order.status === "Done" ? "Pending" : "Done"}
            //       </button>
            //     </li>
            //   ))}
            // </ul>
            <ul className="divide-y divide-gray-200">
  {orders.map((order) => (
    <li key={order.id} className="p-4 bg-white shadow rounded-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Table: {order.tableId}</h3>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            order.printed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {order.printed ? '✔ Printed' : '⏳ Not Printed'}
        </span>
      </div>

      <ul className="text-sm mb-2 ml-4 list-disc">
        {order.order?.map((item, index) => (
          <li key={index}>
            {item.item} (x{item.qty}) – €{(item.price * item.qty).toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-3">
        <p className="font-bold text-gray-800">Total: €{order.total.toFixed(2)}</p>
        <button
          onClick={() => handlePrint(order)}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
        >
          Print Bill
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm">
          Status:{" "}
          <span
            className={`font-semibold ${
              order.status === "Done" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {order.status || "Pending"}
          </span>
        </p>
        <button
          onClick={() =>
            handleStatusChange(order.id, order.status === "Done" ? "Pending" : "Done")
          }
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          Mark as {order.status === "Done" ? "Pending" : "Done"}
        </button>
      </div>
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

      {activeTab === "menu" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
          <input
            className="border p-2 mb-2 block w-full"
            placeholder="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAdd)}
          />
          <input
            className="border p-2 mb-4 block w-full"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAdd)}
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
          >
            Add
          </button>

          <h2 className="text-xl font-semibold mb-3">Menu Items</h2>
          <ul className="space-y-4">
            {menu.map((menuItem) => (
              <li
                key={menuItem.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{menuItem.item}</p>
                  {editingIndex === menuItem.id ? (
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
                  {editingIndex === menuItem.id ? (
                    <button
                      onClick={() => handleSaveEdit(menuItem.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(menuItem.id, menuItem.price)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(menuItem.id)}
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


