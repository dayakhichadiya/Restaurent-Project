import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase'
import { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar";
import html2canvas from 'html2canvas-pro';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [tableId, setTableId] = useState("");
  const billRef = useRef(null);

  const currentDateTime = new Date().toLocaleString();

  const [popupBlocked, setPopupBlocked] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [finalBill, setFinalBill] = useState(null);

  console.log("🚀 ~ Menu ~ orderSent:", orderSent)

  useEffect(() => {
    const storedMenu = JSON.parse(localStorage.getItem("menu")) || [];
    setMenu(storedMenu);
  }, []);

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


  // const sendOrderToAdmin = async () => {
  //   const confirm = window.confirm("Are you sure you want to send this order to the kitchen?");
  //   if (!confirm) return;

  //   try {
  //     console.log("inner try block")
  //     if (tableId && order.length > 0) {
  //       console.log("inner try block i block")

  //       // await addDoc(collection(db, "orders"), {
  //       //   tableId,
  //       //   order,
  //       //   total: order.reduce((sum, o) => sum + o.qty * o.price, 0),
  //       //   timestamp: new Date(),
  //       // });
  //     console.log("inner try block alert beore")


  //       alert("Order sent to the kitchen!");
  //       setOrderSent(true);  // set button state to "sent"
  //       setOrder([]);        // clear current order
  //       setTableId("");      // reset table selection

  //     } else {
  //       alert("Please select a table and add items to the order.");
  //     }

  //   } catch (error) {
  //     console.error("Error sending order: ", error);
  //     alert("Error sending the order.");
  //   }
  // };


  const sendOrderToAdmin = async () => {
    const confirm = window.confirm("Are you sure you want to send this order to the kitchen?");
    if (!confirm) return;

    try {
      if (tableId && order.length > 0) {
        const billData = {
          tableId,
          order: [...order],
          total: order.reduce((sum, o) => sum + o.qty * o.price, 0),
          timestamp: Timestamp.now(),
        };

        // Add to Firestore
        await addDoc(collection(db, "orders"), billData);

        // Save for rendering
        setFinalBill(billData);
        setOrderSent(true);
        setOrder([]);
        setTableId("");
        alert("Order sent to the kitchen!");

        // ✅ Wait for the finalBill to render, then download
        setTimeout(() => {
          if (billRef.current) {
            html2canvas(billRef.current).then((canvas) => {
              const link = document.createElement("a");
              link.download = "restaurant_bill.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            });
          } else {
            console.warn("billRef is not rendered yet.");
          }
        }, 300); // Delay to allow re-render
      } else {
        alert("Please select a table and add items to the order.");
      }
    } catch (error) {
      console.error("Error sending order: ", error);
      alert("Error sending the order.");
    }
  };

  const saveAsImage = () => {
    if (!billRef.current) {
      alert("Bill not ready yet!");
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

  // const saveAsImage = async () => {
  //   if (!billRef.current) return;

  //   // Hide all elements with class 'no-print'
  //   const elementsToHide = billRef.current.querySelectorAll(".no-print");
  //   elementsToHide.forEach((el) => el.style.display = "none");

  //   // Wait for rendering
  //   await new Promise((resolve) => requestAnimationFrame(resolve));

  //   html2canvas(billRef.current, {
  //     scale: 2,
  //     backgroundColor: "#ffffff",
  //     useCORS: true,
  //   }).then((canvas) => {
  //     const imgDataUrl = canvas.toDataURL("image/png");
  //     const newTab = window.open();

  //     if (newTab) {
  //       newTab.document.write(`
  //         <html>
  //           <head><title>Bill Image</title></head>
  //           <body style="margin:0;padding:0;text-align:center;background:white;">
  //             <img src="${imgDataUrl}" style="max-width:100%;margin-top:20px;" />
  //           </body>
  //         </html>
  //       `);
  //     } else {
  //       setPopupBlocked(true);
  //     }

  //     // Restore hidden elements
  //     elementsToHide.forEach((el) => el.style.display = "");
  //   });
  // };

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
        {/* {order.length > 0 && (
          <div
            ref={billRef}
            style={{
              marginTop: "2.5rem",
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              color: "#000000",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  borderBottom: "1px solid #d1d5db", // Tailwind gray-300
                  paddingBottom: "0.5rem",
                }}
              >
                Restaurant Bill
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#4b5563", // Tailwind gray-600
                  marginTop: "0.5rem",
                }}
              >
                Date/Time:{" "}
                {new Date().toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  marginTop: "0.25rem",
                }}
              >
                Table: {tableId || "N/A"}
              </p>
            </div>

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
                  {order.map((o, i) => (
                    <tr key={i} className="border-b text-gray-800">
                      <td className="py-2 flex justify-between items-center gap-2">
                        {o.item}
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
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={o.qty}
                          onChange={(e) => handleQtyChange(i, e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2 text-right">€{(o.qty * o.price).toFixed(2)}</td>
                    </tr>
                  ))}


                </tbody>
              </table>
              
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={sendOrderToAdmin}
                      disabled={orderSent}
                      className={`${ orderSent ? "bg-green-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-6 py-2 rounded font-semibold transition`}
                    >
                      {orderSent ? "Order Sent" : "Send Order to Kitchen"}
                    </button>
                  </div>
            </div>

            <div className="text-right font-bold text-xl pt-4 mt-4 border-t text-gray-900">
              Grand Total: €{total.toFixed(2)}
            </div>

            <div className="flex justify-end mt-6 no-print">
              <button
                onClick={saveAsImage}
                disabled={!tableId}
                className={`${tableId
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-300 cursor-not-allowed"
                  } text-black px-6 py-2 rounded font-semibold`}
              >
                Show Bill
              </button>
            </div>
          </div>
        )} */}



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

              {order.length > 0 && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={sendOrderToAdmin}
                    disabled={orderSent}
                    className={`${orderSent
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-6 py-2 rounded font-semibold transition`}
                  >
                    {orderSent ? "Order Sent" : "Send Order to Kitchen"}
                  </button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="text-right font-bold text-xl pt-4 mt-4 border-t text-gray-900">
              Grand Total: €
              {/* {(order.length > 0
                ? order.reduce((sum, o) => sum + o.qty * o.price, 0)
                : finalBill?.total || 0
              ).toFixed(2)}
            </div> */}

              {(order.length > 0
                ? order.reduce((sum, o) => sum + o.qty * o.price, 0)
                : finalBill?.total || 0
              ).toFixed(2)}
            </div>


            {/* Show Bill Button */}
            {/* <div className="flex justify-end mt-6 no-print">
              <button
                onClick={saveAsImage}
                disabled={!finalBill}
                className={`${finalBill
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-300 cursor-not-allowed"
                  } text-black px-6 py-2 rounded font-semibold`}
              >
                Show Bill
              </button>
            </div> */}
            <div className="flex justify-end mt-6 no-print">
              <button
                onClick={saveAsImage}
                disabled={!tableId && !finalBill}
                className={`${tableId || finalBill
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-300 cursor-not-allowed"
                  } text-black px-6 py-2 rounded font-semibold`}
              >
                Show Bill
              </button>
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
