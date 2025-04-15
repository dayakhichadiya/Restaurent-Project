

// import { useEffect, useState, useRef } from "react";
// import Navbar from "../component/Navbar";
// import html2canvas from "html2canvas";

// export default function Menu() {
//   const [menu, setMenu] = useState([]);
//   const [order, setOrder] = useState([]);
//   const [tableId, setTableId] = useState("");
//   const billRef = useRef(null);

//   useEffect(() => {
//     const storedMenu = JSON.parse(localStorage.getItem("menu")) || [];
//     setMenu(storedMenu);
//   }, []);

//   const handleOrder = (item) => {
//     const existing = order.find((o) => o.item === item.item);
//     if (existing) {
//       setOrder(
//         order.map((o) =>
//           o.item === item.item ? { ...o, qty: o.qty + 1 } : o
//         )
//       );
//     } else {
//       setOrder([...order, { ...item, qty: 1 }]);
//     }
//   };

//   const handleQtyChange = (index, qty) => {
//     const updated = [...order];
//     updated[index].qty = Number(qty);
//     setOrder(updated);
//   };

//   const total = order.reduce((sum, o) => sum + o.qty * o.price, 0);

//   // const saveAsImage = async () => {
//   //   if (billRef.current) {
//   //     const canvas = await html2canvas(billRef.current);
//   //     const link = document.createElement("a");
//   //     link.download = `bill_${tableId || "order"}.png`;
//   //     link.href = canvas.toDataURL("image/png");
//   //     link.click();
//   //   }
//   // };


//   // const saveAsImage = async () => {
//   //   if (billRef.current) {
//   //     const canvas = await html2canvas(billRef.current, { scale: 2 });
//   //     const imgDataUrl = canvas.toDataURL("image/png");

//   //     // Mobile-friendly: open in a new tab
//   //     const newTab = window.open();
//   //     if (newTab) {
//   //       newTab.document.write(`<img src="${imgDataUrl}" alt="Bill Image" />`);
//   //     } else {
//   //       alert("Please allow popups for this site to view the bill image.");
//   //     }
//   //   }
//   // };

//   const saveAsImage = async () => {
//     if (billRef.current) {
//       await new Promise((res) => setTimeout(res, 100)); // tiny delay
//       const canvas = await html2canvas(billRef.current, { scale: 2 });
//       const imgDataUrl = canvas.toDataURL("image/png");

//       const newTab = window.open();
//       if (newTab) {
//         newTab.document.write(`<img src="${imgDataUrl}" alt="Bill Image" />`);
//       } else {
//         alert("Please allow popups for this site to view the bill image.");
//       }
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="pt-24 px-4 max-w-4xl mx-auto">
//         <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Our Menu</h2>

//         {/* Table Selection */}
//         <div className="mb-6 text-center">
//           <label className="block mb-2 text-lg font-semibold">Select Table Number:</label>
//           <select
//             value={tableId}
//             onChange={(e) => setTableId(e.target.value)}
//             className="border p-2 rounded w-full md:w-1/2"
//           >
//             <option value="">-- Select Table --</option>
//             {Array.from({ length: 20 }, (_, i) => (
//               <option key={i} value={`Table ${i + 1}`}>{`Table ${i + 1}`}</option>
//             ))}
//           </select>
//         </div>

//         {/* Menu Items */}
//         {menu.length === 0 ? (
//           <p className="text-center text-gray-500">No menu items available</p>
//         ) : (
//           <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//             {menu.map((item, index) => (
//               <li key={index} className="bg-white shadow-md p-4 rounded-lg">
//                 <h3 className="text-xl font-semibold">{item.item}</h3>
//                 <p className="text-gray-600 mb-2">Price: ₹{item.price}</p>
//                 <button
//                   onClick={() => handleOrder(item)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   Add to Order
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Bill Summary */}
//         {order.length > 0 && (
//           // <div ref={billRef} className="mt-10 bg-white p-6 rounded-lg shadow-md">
//           //   <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
//           //   <p className="mb-2 font-medium">Table: {tableId || "N/A"}</p>

//           //   <ul className="mb-4">
//           //     {order.map((o, index) => (
//           //       <li key={index} className="flex justify-between items-center mb-2">
//           //         <span>{o.item}</span>
//           //         <input
//           //           type="number"
//           //           value={o.qty}
//           //           min="1"
//           //           onChange={(e) => handleQtyChange(index, e.target.value)}
//           //           className="w-16 text-center border rounded px-2 py-1"
//           //         />
//           //         <span>₹{o.qty * o.price}</span>
//           //       </li>
//           //     ))}
//           //   </ul>

//           //   <div className="text-right font-semibold text-lg mb-2">
//           //     Total: ₹{total}
//           //   </div>

//           //   <div className="flex justify-end mt-4">
//           //     <button
//           //       onClick={saveAsImage}
//           //       disabled={!tableId}
//           //       className={`${
//           //         tableId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 cursor-not-allowed"
//           //       } text-black px-4 py-2 rounded`}
//           //     >
//           //       Save Bill as Image
//           //     </button>
//           //   </div>
//           // </div>

//           <div
//             ref={billRef}
//             className="mt-10 bg-white p-6 rounded-lg shadow-md overflow-visible text-black"
//           >
//             <h3 className="text-2xl font-bold mb-4 border-b pb-2">Order Summary</h3>

//             <p className="mb-4 font-medium">Table: {tableId || "N/A"}</p>

//             <ul className="mb-6 space-y-2">
//               {order.map((o, index) => (
//                 <li
//                   key={index}
//                   className="flex justify-between items-center text-base border-b pb-1"
//                 >
//                   <span>{o.item}</span>
//                   <input
//                     type="number"
//                     value={o.qty}
//                     min="1"
//                     onChange={(e) => handleQtyChange(index, e.target.value)}
//                     className="w-16 text-center border rounded px-2 py-1 mx-2"
//                   />
//                   <span>₹{o.qty * o.price}</span>
//                 </li>
//               ))}
//             </ul>

//             <div className="text-right font-semibold text-lg border-t pt-2">
//               Total: ₹{total}
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={saveAsImage}
//                 disabled={!tableId}
//                 className={`${tableId
//                     ? "bg-yellow-500 hover:bg-yellow-600"
//                     : "bg-gray-400 cursor-not-allowed"
//                   } text-black px-4 py-2 rounded`}
//               >
//                 Save Bill as Image
//               </button>
//             </div>
//           </div>

//         )}
//       </div>
//     </>
//   );
// }


import { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar";
import html2canvas from 'html2canvas-pro';


export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [tableId, setTableId] = useState("");
  const billRef = useRef(null);

  const currentDateTime = new Date().toLocaleString();


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

  const handleQtyChange = (index, qty) => {
    const updated = [...order];
    updated[index].qty = Number(qty);
    setOrder(updated);
  };

  const total = order.reduce((sum, o) => sum + o.qty * o.price, 0);

  const saveAsImage = async () => {
    if (!billRef.current) return;
  
    // Wait for rendering
    await new Promise((resolve) => requestAnimationFrame(resolve));
  
    html2canvas(billRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    }).then((canvas) => {
      const imgDataUrl = canvas.toDataURL("image/png");
      const newTab = window.open();
  
      if (newTab) {
        newTab.document.write(`
          <html>
            <head><title>Bill Image</title></head>
            <body style="margin:0;padding:0;text-align:center;background:white;">
              <img src="${imgDataUrl}" style="max-width:100%;margin-top:20px;" />
            </body>
          </html>
        `);
      } else {
        alert("Please allow popups for this site to view the bill image.");
      }
    });
  };
  

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

        
        {/* {order.length > 0 && (
          <div
            ref={billRef}
            className="mt-10 bg-white p-6 rounded-lg shadow-md overflow-visible text-black w-full"
          >
            <div className="text-center mb-6">
              <h3 className="text-3xl font-extrabold text-gray-800 mb-2 border-b pb-2">
                Restaurant Bill
              </h3>
              <p className="text-sm text-gray-600">Date/Time: {currentDateTime}</p>
              <p className="text-sm font-medium">Table: <span className="text-black">{tableId || "N/A"}</span></p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-t border-b">
                <thead>
                  <tr className="text-gray-700 font-semibold border-b">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Quantity</th>
                    <th className="py-2 text-right">Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((o, index) => (
                    <tr key={index} className="border-b text-gray-700">
                      <td className="py-2">{o.item}</td>
                      <td className="py-2 text-center">
                        <input
                          type="number"
                          value={o.qty}
                          min="1"
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                          className="w-16 text-center border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2 text-right">€{(o.qty * o.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right font-bold text-xl pt-4 mt-4 border-t">
              Grand Total: €{total.toFixed(2)}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveAsImage}
                disabled={!tableId}
                className={`${tableId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-400 cursor-not-allowed"
                  } text-black px-6 py-2 rounded font-medium`}
              >
                Show Bill
              </button>
            </div>
          </div>
        )} */}


{order.length > 0 && (

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
              <td className="py-2">{o.item}</td>
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
    </div>

    <div className="text-right font-bold text-xl pt-4 mt-4 border-t text-gray-900">
      Grand Total: €{total.toFixed(2)}
    </div>

    <div className="flex justify-end mt-6">
      <button
        onClick={saveAsImage}
        disabled={!tableId}
        className={`${
          tableId
            ? "bg-yellow-400 hover:bg-yellow-500"
            : "bg-gray-300 cursor-not-allowed"
        } text-black px-6 py-2 rounded font-semibold`}
      >
        Show Bill
      </button>
    </div>
  </div>
)}


      </div>
    </>
  );
}


{/* Bill Summary */}
        {/* {order.length > 0 && (
          <div
            ref={billRef}
            className="mt-10 bg-white p-6 rounded-lg shadow-md overflow-visible text-black w-full"
          >

            <h3 className="text-2xl font-bold mb-4 border-b pb-2">Order Summary</h3>

            <p className="mb-2 text-sm text-gray-600">Date/Time: {currentDateTime}</p>
            <p className="mb-4 font-medium">Table: {tableId || "N/A"}</p>


            <ul className="mb-6 space-y-2">
              {order.map((o, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-base border-b pb-1"
                >
                  <span>{o.item}</span>
                  <input
                    type="number"
                    value={o.qty}
                    min="1"
                    onChange={(e) => handleQtyChange(index, e.target.value)}
                    className="w-16 text-center border rounded px-2 py-1 mx-2"
                  />
                  <span>€{o.qty * o.price}</span>
                </li>
              ))}
            </ul>

            <div className="text-right font-bold text-xl border-t pt-3 mt-4">
              Grand Total: €{total}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={saveAsImage}
                disabled={!tableId}
                className={`${
                  tableId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-black px-4 py-2 rounded`}
              >
                Show Bill 
              </button>
            </div>
          </div>
        )} */}
