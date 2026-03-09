import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BillDetails() {
  const { id } = useParams();

  const [bill, setBill] = useState(null);
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(false);

  const billRef = useRef();

  useEffect(() => {
    loadBill();
  }, []);

  const loadBill = async () => {
    try {
      const res = await API.get(`/billing/${id}`);

      setBill(res.data.bill);
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  /* EDIT SERVICE */

  const updateItem = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    setItems(updated);
  };

  /* ADD SERVICE */

  const addService = () => {
    setItems([
      ...items,
      {
        item_name: "",
        amount: 0,
      },
    ]);
  };

  /* REMOVE SERVICE */

  const removeService = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* TOTAL */

  const subtotal = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const tax = bill?.payment_mode === "card" ? subtotal * 0.02 : 0;

  const total = subtotal + tax;

  /* SAVE BILL */

  const saveBill = async () => {
    try {
      await API.put(`/billing/${id}`, {
        payment_mode: bill.payment_mode,

        items: items.map((i) => ({
          name: i.item_name,
          amount: i.amount,
        })),
      });

      setEdit(false);

      loadBill();
    } catch (err) {
      console.error(err);
    }
  };

  /* PRINT */

  const printBill = () => {
    window.print();
  };

  /* DOWNLOAD */

  const downloadPDF = async () => {
    const canvas = await html2canvas(billRef.current, {
      scale: 2,
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();

    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);

    pdf.save(`bill-${bill.id}.pdf`);
  };

  if (!bill) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6 flex justify-center">
          <div ref={billRef} className="bill-container">
            {/* HEADER */}

            <div className="bill-header">
              <h2>SHERINS FERTILITY CLINIC</h2>

              <p>No 305, 19th St, Astalakshmi Nagar</p>

              <p>Alapakkam, Chennai - 600116</p>

              <p>www.drsherins.com | +91 7200176328</p>
            </div>

            {/* PATIENT */}

            <div className="bill-grid">
              <div>
                <p>
                  <b>Name :</b> {bill.patient}
                </p>

                <p>
                  <b>Phone :</b> {bill.phone}
                </p>
              </div>

              <div>
                <p>
                  <b>Doctor :</b> {bill.doctor}
                </p>

                <p>
                  <b>Date :</b>
                  {new Date(bill.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            {/* SERVICES */}

            <div className="services">
              <h3>Services</h3>

              <table>
                <thead>
                  <tr>
                    <th>Service</th>

                    <th>Fee</th>

                    {edit && <th></th>}
                  </tr>
                </thead>

                <tbody>
                  {items.map((i, index) => (
                    <tr key={index}>
                      <td>
                        {edit ? (
                          <input
                            value={i.item_name}
                            onChange={(e) =>
                              updateItem(index, "item_name", e.target.value)
                            }
                          />
                        ) : (
                          i.item_name
                        )}
                      </td>

                      <td>
                        {edit ? (
                          <input
                            type="number"
                            value={i.amount}
                            onChange={(e) =>
                              updateItem(index, "amount", e.target.value)
                            }
                          />
                        ) : (
                          <>₹ {i.amount}</>
                        )}
                      </td>

                      {edit && (
                        <td>
                          <button onClick={() => removeService(index)}>
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {edit && <button onClick={addService}>Add Service</button>}
            </div>

            {/* TOTAL */}

            <div className="summary">
              <p>Subtotal : ₹ {subtotal}</p>

              <p>Tax : ₹ {tax.toFixed(2)}</p>

              <h3>Total : ₹ {total.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex justify-end gap-3 p-6 no-print">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Bill
            </button>
          ) : (
            <button
              onClick={saveBill}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}

          <button
            onClick={downloadPDF}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Download
          </button>

          <button
            onClick={printBill}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>

        <style>{`

.bill-container{
width:900px;
background:white;
padding:40px;
border:1px solid #ccc;
}

.bill-header{
text-align:center;
border-bottom:1px solid #ccc;
padding-bottom:10px;
}

.bill-grid{
display:flex;
justify-content:space-between;
margin-top:20px;
}

.services{
margin-top:30px;
}

.services table{
width:100%;
border-collapse:collapse;
}

.services th,
.services td{
border-bottom:1px solid #ddd;
padding:6px;
}

.summary{
margin-top:20px;
text-align:right;
}

@media print{

body *{
visibility:hidden;
}

.bill-container,
.bill-container *{
visibility:visible;
}

.bill-container{
position:absolute;
left:0;
top:0;
width:100%;
}

.no-print{
display:none !important;
}

}

`}</style>
      </div>
    </div>
  );
}

export default BillDetails;
