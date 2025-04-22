import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from '../firebase'
import { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar";
import html2canvas from 'html2canvas-pro';
import toast from "react-hot-toast";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [tableId, setTableId] = useState("");
  const billRef = useRef(null);

  const currentDateTime = new Date().toLocaleString();

  const [orderSent, setOrderSent] = useState(false);
  const [finalBill, setFinalBill] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  console.log("🚀 ~ Menu ~ orderSent:", orderSent)

  // useEffect(() => {
  //   const storedMenu = JSON.parse(localStorage.getItem("menu")) || [];
  //   setMenu(storedMenu);
  // }, []);


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuRef = collection(db, "menu");
        const snapshot = await getDocs(menuRef);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenu(items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
  
    fetchMenuItems();
  }, []);
  
  useEffect(() => {
    if (orderSent && billRef.current) {
      // Wait 100ms after setting final bill for render to complete
      const timer = setTimeout(() => {
        html2canvas(billRef.current).then((canvas) => {
          const link = document.createElement("a");
          link.download = "restaurant_bill.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [orderSent]);


  const handleOrder = (item) => {
    const existing = order.find((o) => o.item === item.item);
    if (existing) {
      setOrder(
        order.map((o) =>
          o.item === item.item ? { ...o, qty: o.qty + 1 } : o
        )
      );
    } else {
      setOrder([...order, { ...item, qty: 1 }]);
    }
  };

// tost - notification


// Show a custom toast confirmation
const showConfirmToast = (onConfirm, onCancel) => {
  toast.custom((t) => (
    <div className="bg-white shadow-md rounded px-4 py-3 border border-gray-300 flex flex-col space-y-2 w-72">
      <p className="font-medium text-gray-800">Send order to kitchen?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onCancel();
          }}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Confirm
        </button>
      </div>
    </div>
  ));
};

const sendOrderToAdmin = async () => {
  // Step 1: Validate table first
  if (!tableId.trim()) {
    toast.error("Please select a valid table");
    return;
  }

  // Step 2: Validate if order has items
  if (order.length === 0) {
    toast.error("Please add items to the order");
    return;
  }

  // Step 3: Passed validation — show confirmation
  showConfirmToast(
    async () => {
      setIsLoading(true);
      try {
        const billData = {
          tableId,
          order: [...order],
          total: order.reduce((sum, o) => sum + o.qty * o.price, 0),
          timestamp: Timestamp.now(),
        };

        await addDoc(collection(db, "orders"), billData);

        setFinalBill(billData);
        setOrderSent(true);
        setOrder([]);
        setTableId("");

        toast.success("Order sent to kitchen!",{
          duration: 3000, 
        });
      } catch (error) {
        console.error("Error sending order: ", error);
        toast.error("Error sending the order.",{
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    () => {
      toast("Order not sent", { icon: "❌" });
    }
  );
};

  const saveAsImage = () => {
    if (!billRef.current) {
      // alert("Bill not ready yet!");
      toast.error("Bill not ready yet!");
      return;
    }

    html2canvas(billRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "restaurant_bill.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };


  const handleQtyChange = (index, qty) => {
    const value = Math.max(1, Number(qty));
    const updated = [...order];
    updated[index].qty = value;
    setOrder(updated);
  };


  const total = order.reduce((sum, o) => sum + o.qty * o.price, 0);


  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Our Menu</h2>

        {/* Table Selection */}
        <div className="mb-6 text-center">
          <label className="block mb-2 text-lg font-semibold">Select Table Number:</label>
          <select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">-- Select Table --</option>
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i} value={`Table ${i + 1}`}>{`Table ${i + 1}`}</option>
            ))}
          </select>
        </div>

        {/* Menu Items */}
        {menu.length === 0 ? (
          <p className="text-center text-gray-500">No menu items available</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {menu.map((item, index) => (
              <li key={index} className="bg-white shadow-md p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{item.item}</h3>
                <p className="text-gray-600 mb-2">Price: €{item.price}</p>
                <button
                  onClick={() => handleOrder(item)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add to Order
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* order summary */}



        {(order.length > 0 || finalBill) && (
          <div ref={billRef} className="your-bill-class">

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Restaurant Bill</h3>
              <p className="text-sm text-gray-600 mt-2">
                Date/Time: {new Date().toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Table: {(order.length > 0 ? tableId : finalBill?.tableId) || "N/A"}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t border-b">
                <thead>
                  <tr className="text-gray-700 font-semibold border-b">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price (€)</th>
                  </tr>
                </thead>
                <tbody>

                  {(order.length > 0 ? order : finalBill?.order)?.map((o, i) => (
                    <tr key={i} className="border-b text-gray-800">
                      <td className="py-2 flex justify-between items-center gap-2">
                        {o.item}
                        {order.length > 0 && (
                          <button
                            onClick={() => {
                              const updated = [...order];
                              updated.splice(i, 1);
                              setOrder(updated);
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm ml-2 no-print"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                      <td className="py-2 text-center">
                        {order.length > 0 ? (
                          <input
                            type="number"
                            min="1"
                            value={o.qty}
                            onChange={(e) => handleQtyChange(i, e.target.value)}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          o.qty
                        )}
                      </td>
                      <td className="py-2 text-right">€{(o.qty * o.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            
              {(order.length > 0 || orderSent) && (
                <div className="flex justify-end mt-6">
                  {!orderSent ? (
                    <button
                      onClick={sendOrderToAdmin}
                      disabled={isLoading}
                      className={`${isLoading
                          ? "bg-blue-300 cursor-wait"
                          : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-6 py-2 rounded font-semibold transition`}
                    >
                      {isLoading ? "Sending..." : "Send Order"}
                    </button>
                  ) : (
                    <button
                      onClick={saveAsImage}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded font-semibold"
                    >
                      Show Bill
                    </button>
                  )}
                </div>
              )}


            </div>

            {/* Total */}
            <div className="text-right font-bold text-xl pt-4 mt-4 border-t text-gray-900">
              Grand Total: €
              {(order.length > 0
                ? order.reduce((sum, o) => sum + o.qty * o.price, 0)
                : finalBill?.total || 0
              ).toFixed(2)}
            </div>

            {order.length === 0 && finalBill && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setFinalBill(null);
                    setOrderSent(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
                >
                  Start New Order
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </>
  );
}


