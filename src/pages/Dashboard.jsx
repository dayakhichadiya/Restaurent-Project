  import { useEffect, useState } from "react";
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
    serverTimestamp,
    deleteDoc
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
      localStorage.clear();
    }, []);
    
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

    // useEffect(() => {
    //   const q = query(collection(db, "menu"), orderBy("timestamp", "desc"));
    //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     const menuList = [];
    //     querySnapshot.forEach((doc) => {
    //       menuList.push({ id: doc.id, ...doc.data() });
    //     });
    //     setMenu(menuList);
    //   });
    //   return () => unsubscribe();
    // }, []);

    useEffect(() => {
      const q = query(collection(db, "menu"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const menuList = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          menuList.push({ id: docSnap.id, ...data });
        });
        setMenu(menuList);
      });
      return () => unsubscribe();
    }, []);
    

    const handlePasswordCheck = () => {
      if (adminInput === ADMIN_PASSWORD) {
        setAuthPassed(true);
      } else {
        // alert("Incorrect admin password");
        toast.error("incorrect admin password!");
      }
    };

    const handleAdd = async () => {
      if (!item || !price) return alert("Fill all fields");
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
        // alert("Price updated!");
        toast.success("Price updated !");
      } catch (error) {
        console.error("Error updating price:", error);
        // alert("Failed to update price.");
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
        Status: order.status || "Pending",
        Items: order.order.map((i) => `${i.item} (x${i.qty})`).join(", "),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(workbook, "orders.xlsx");

      try {
        const deletePromises = orders.map((order) => {
          const orderRef = doc(db, "orders", order.id);
          return updateDoc(orderRef, { deleted: true });
        });

        await Promise.all(deletePromises);
        alert("Excel downloaded and all orders removed.");
        toast.success("Excel downloaded and all orders removed.");
      } catch (error) {
        console.error("Error deleting orders:", error);
        // alert("Failed to delete some orders.");
        toast.error("Failed to delete some orders.");
      }
    };
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const orderList = [];
    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     if (!data.deleted) {
    //       orderList.push({ id: doc.id, ...data });
    //     }
    //   });
    //   setOrders(orderList);
    // });
    
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
              <ul>
                {orders.map((order) => (
                  <li key={order.id} className="p-4 border-b">
                    <p>Table: {order.tableId}</p>
                    <ul className="text-sm mb-2">
                      {order.order?.map((item, index) => (
                        <li key={index}>
                          {item.item} (x{item.qty}) - €{(item.price * item.qty).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p className="font-bold">Total: €{order.total.toFixed(2)}</p>
                    <p className="text-sm">
                      Status: <span className={`font-semibold ${order.status === "Done" ? "text-green-600" : "text-yellow-600"}`}>{order.status || "Pending"}</span>
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


