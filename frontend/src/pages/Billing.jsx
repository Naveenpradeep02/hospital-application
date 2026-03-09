import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

function Billing() {
  const billRef = useRef();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const [consultDate, setConsultDate] = useState("");

  const [paymentMode, setPaymentMode] = useState("cash");

  const [services, setServices] = useState([
    { name: "Consultation", price: 0 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await API.get("/patients");
    const d = await API.get("/doctors");

    setPatients(p.data);
    setDoctors(d.data);
  };

  /* PATIENT SEARCH */

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectPatient = (p) => {
    setPatient(p);
    setSearch(p.name);
  };

  /* DOCTOR SELECT */

  const selectDoctor = (id) => {
    const d = doctors.find((x) => x.id == id);
    setDoctor(d);

    setServices([
      {
        name: "Consultation",
        price: d.consultation_fee,
      },
    ]);
  };

  /* SERVICES */

  const addService = () => {
    setServices([...services, { name: "", price: 0 }]);
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  /* TOTAL */

  const subtotal = services.reduce((sum, s) => sum + Number(s.price || 0), 0);

  const processingFee = paymentMode === "card" ? subtotal * 0.02 : 0;

  const total = subtotal + processingFee;

  /* SAVE BILL */

  const saveBill = async () => {
    try {
      if (!patient || !doctor) {
        alert("Select patient and doctor");
        return null;
      }

      const items = services.map((s) => ({
        name: s.name,
        type: "service",
        amount: Number(s.price),
      }));

      const res = await API.post("/billing", {
        appointment_id: patient.id,
        payment_mode: paymentMode,
        items,
      });

      return res.data.bill.id;
    } catch (err) {
      console.error(err);
      alert("Failed to save bill");
      return null;
    }
  };

  /* DOWNLOAD */

  const downloadPDF = async () => {
    const billId = await saveBill();
    if (!billId) return;

    const elements = document.querySelectorAll(".no-print");
    elements.forEach((el) => (el.style.display = "none"));

    const canvas = await html2canvas(billRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, imgHeight);

    pdf.save(`bill-${billId}.pdf`);

    elements.forEach((el) => (el.style.display = "block"));
  };

  /* PRINT */

  const printBill = async () => {
    const billId = await saveBill();
    if (!billId) return;

    window.print();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen ">
        <Header />

        <div className="p-6 flex justify-center flex-col">
          <div className="flex align-middle justify-end ">
            <div className="">
              <Link to="/bills" className="p-4 bg-gray-700 text-white">
                View All Bills
              </Link>
            </div>
          </div>

          <div ref={billRef} className="bill-container">
            <div className="bill-header">
              <h2>SHERINS FERTILITY CLINIC</h2>

              <p>No 305, 19th St, Astalakshmi Nagar</p>

              <p>Alapakkam, Chennai - 600116</p>

              <p>www.drsherins.com | +91 7200176328</p>
            </div>

            {/* PATIENT */}

            <div className="bill-grid">
              <div>
                <label>Patient Search</label>

                <input
                  type="text"
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && !patient && (
                  <div className="search-results">
                    {filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        className="search-item"
                        onClick={() => selectPatient(p)}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}

                {patient && (
                  <div className="patient-info">
                    <p>Name : {patient.name}</p>
                    <p>Age : {patient.age}</p>
                    <p>Phone : {patient.phone}</p>
                    <p>Address : {patient.address}</p>
                  </div>
                )}
              </div>

              {/* DOCTOR */}

              <div>
                <label>Consultant</label>

                <select onChange={(e) => selectDoctor(e.target.value)}>
                  <option>Select Doctor</option>

                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <div>
                  <label>Date</label>

                  <input
                    type="date"
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                  />
                </div>
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
                    <th className="no-print"></th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          value={s.name}
                          onChange={(e) =>
                            updateService(i, "name", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={s.price}
                          onChange={(e) =>
                            updateService(i, "price", e.target.value)
                          }
                        />
                      </td>

                      <td className="no-print">
                        <button onClick={() => removeService(i)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="no-print" onClick={addService}>
                Add Service
              </button>
            </div>

            {/* PAYMENT */}

            <div className="payment">
              <label>Payment Mode</label>

              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>

            {/* SUMMARY */}

            <div className="summary">
              <p>Subtotal : ₹ {subtotal}</p>

              {paymentMode === "card" && (
                <p>Card Fee (2%) : ₹ {processingFee.toFixed(2)}</p>
              )}

              <h3>Total : ₹ {total.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="actions no-print">
          <button onClick={downloadPDF}>Download Bill</button>

          <button onClick={printBill}>Print Bill</button>
        </div>
      </div>

      {/* CSS */}

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

      .actions{
        text-align:right;
        padding:20px;
      }

      .search-results{
        border:1px solid #ddd;
        background:white;
        max-height:150px;
        overflow:auto;
      }

      .search-item{
        padding:5px;
        cursor:pointer;
      }

      .search-item:hover{
        background:#f0f0f0;
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
  );
}

export default Billing;
