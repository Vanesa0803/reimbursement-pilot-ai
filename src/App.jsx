import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";

function App() {
  const [tripName, setTripName] = useState("");
  const [category, setCategory] = useState("Food");
  const [bills, setBills] = useState([]);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const foodCount = bills.filter(
  (bill) => bill.category === "Food"
).length;

const hotelCount = bills.filter(
  (bill) => bill.category === "Hotel"
).length;

const travelCount = bills.filter(
  (bill) => bill.category === "Travel"
).length;

const totalCount = bills.length;
  const handleUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const newBill = {
    file,
    name: file.name,
    category,
    image: URL.createObjectURL(file),
  };

  
  setBills([...bills, newBill]);
};

const handleDrop = (e) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (!file) return;

  const newBill = {
    file,
    name: file.name,
    category,
    image: URL.createObjectURL(file),
  };

  setBills((prev) => [...prev, newBill]);
};

const generateZip = async () => {
  const zip = new JSZip();

  const foodFolder = zip.folder("Food");
  const hotelFolder = zip.folder("Hotel");
  const travelFolder = zip.folder("Travel");

  for (const bill of bills) {
    
    const imageData = await new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = () => resolve(reader.result);

  reader.onerror = reject;

  reader.readAsDataURL(bill.file);
});

const img = new Image();

await new Promise((resolve) => {
  img.onload = resolve;
  img.src = imageData;
});

const pdf = new jsPDF();

const pdfWidth = 190;
const pdfHeight =
  (img.height * pdfWidth) / img.width;

const imageType =
  bill.file.type === "image/png"
    ? "PNG"
    : "JPEG";

pdf.addImage(
  imageData,
  imageType,
  10,
  10,
  pdfWidth,
  pdfHeight
);

    const pdfBlob = pdf.output("blob");

    const pdfName = bill.name.replace(
      /\.[^/.]+$/,
      ""
    ) + ".pdf";

    if (bill.category === "Food") {
      foodFolder.file(pdfName, pdfBlob);
    }

    if (bill.category === "Hotel") {
      hotelFolder.file(pdfName, pdfBlob);
    }

    if (bill.category === "Travel") {
      travelFolder.file(pdfName, pdfBlob);
    }
  }

  const content = await zip.generateAsync({
    type: "blob",
  });

  saveAs(
    content,
    `${tripName || "ExpensePackage"}.zip`
  );

  confetti({
  particleCount: 150,
  spread: 90,
});

  setSuccessMessage(
    `✅ ${tripName || "Expense Package"} downloaded successfully!`
  );

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8">

      <div className="max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

        <div className="text-center mb-12">
          <h1 className="text-7xl font-extrabold mb-4 tracking-tight">
  ReimbursementPilot AI
</h1>

          <p className="text-slate-300 text-2xl">
  AI-Powered Travel Expense Automation
</p>

          <p className="text-slate-500 mt-2">
            Built with ❤️ for Stress-Free Reimbursements
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="
          bg-white/10
          backdrop-blur-lg
          rounded-3xl
          p-6
          border border-white/10
          hover:-translate-y-2
          hover:border-blue-500
          hover:shadow-xl
          hover:shadow-blue-500/20
          transition-all
          duration-300
          x">

   <p className="text-3xl mb-2">🍔</p>
            <h3 className="text-slate-300">Food</h3>
            <p className="text-4xl font-bold">{foodCount}</p>
          </div>

           <div className="
          bg-white/10
          backdrop-blur-lg
          rounded-3xl
          p-6
          border border-white/10
          hover:-translate-y-2
          hover:border-blue-500
          hover:shadow-xl
          hover:shadow-blue-500/20
          transition-all
          duration-300
          hover:shadow-blue-500/30
hover:-translate-y-2
          x">
            <p className="text-3xl mb-2">🏨</p>
            <h3 className="text-slate-300">Hotel</h3>
            <p className="text-4xl font-bold">{hotelCount}</p>
          </div>

           <div className="
          bg-white/10
          backdrop-blur-lg
          rounded-3xl
          p-6
          border border-white/10
          hover:-translate-y-2
          hover:border-blue-500
          hover:shadow-xl
          hover:shadow-blue-500/20
          transition-all
          duration-300
          hover:shadow-blue-500/30
hover:-translate-y-2
          x">
            <p className="text-3xl mb-2">🚕</p>
            <h3 className="text-slate-300">Travel</h3>
            <p className="text-4xl font-bold">{travelCount}</p>
          </div>

           <div className="
          bg-white/10
          backdrop-blur-lg
          rounded-3xl
          p-6
          border border-white/10
          hover:-translate-y-2
          hover:border-blue-500
          hover:shadow-xl
          hover:shadow-blue-500/20
          transition-all
          duration-300
          hover:shadow-blue-500/30
hover:-translate-y-2
          x">
            <p className="text-3xl mb-2">📑</p>
            <h3>Total</h3>
            <p className="text-4xl font-bold">{totalCount}</p>
          </div>

        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">

          <input
            type="text"
            placeholder="Enter Trip Name"
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 mb-6"
            value={tripName}
onChange={(e) => setTripName(e.target.value)}
          />

          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 mb-6"
>
            <option>Food</option>
            <option>Hotel</option>
            <option>Travel</option>
          </select>

          <div
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
  className="
  border-2
  border-dashed
  border-slate-600
  rounded-3xl
  p-12
  text-center
  mb-8
  hover:border-blue-500
  transition-all
  duration-300
  "
>

            <div className="text-6xl mb-4">
              📸
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Upload Receipt
            </h2>

            <p className="text-slate-400 mb-6">
  Drag & Drop Receipt Here or Click Below
</p>

           <input
  type="file"
  accept="image/*"
  onChange={handleUpload}
/>
          </div>

{bills.length > 0 && (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">
      Uploaded Receipts ({totalCount})
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {bills.map((bill, index) => (
        <div
  key={index}
  className="bg-slate-900 rounded-2xl overflow-hidden
             hover:scale-105
             hover:shadow-2xl
             hover:shadow-blue-500/20
             transition-all
             duration-300"
>
          <img
            src={bill.image}
            alt={bill.name}
            className="w-full h-48 object-cover"
          />

          <div className="p-4">
  <p className="font-medium truncate">
    {bill.name}
  </p>

  <p className="text-sm text-slate-400 mt-1">
    {bill.category}
  </p>

  <button
    onClick={() =>
      setBills(bills.filter((_, i) => i !== index))
    }
    className="mt-3 w-full bg-red-500 hover:bg-red-600 rounded-xl py-2 transition-all"
  >
    🗑 Delete
  </button>
</div>
        </div>
      ))}

    </div>
  </div>
)}

          <button
  onClick={generateZip}
  disabled={bills.length === 0}
  

  className="
w-full
bg-blue-600
hover:bg-blue-500
disabled:opacity-50
disabled:cursor-not-allowed
transition-all
duration-300
rounded-2xl
py-5
text-xl
font-semibold
"
>
            🚀 Generate Expense Package
          </button>

          <div className="
bg-slate-900/70
border
border-white/10
rounded-2xl
p-5
mb-6
">

  <h3 className="text-xl font-bold mb-4">
    📊 Trip Summary
  </h3>

  <div className="space-y-2 text-slate-300">

    <p>
      🧳 Trip:
      <span className="text-white ml-2">
        {tripName || "Not Entered"}
      </span>
    </p>

    <p>🍔 Food Receipts: {foodCount}</p>

    <p>🏨 Hotel Receipts: {hotelCount}</p>

    <p>🚕 Travel Receipts: {travelCount}</p>

    <hr className="border-slate-700 my-3" />

    <p className="text-lg font-semibold text-white">
      📑 Total Receipts: {totalCount}
    </p>

  </div>

</div>

          {SuccessMessage && (
  <div
    className="
    fixed
    top-6
    right-6
    bg-green-500
    text-white
    px-6
    py-4
    rounded-2xl
    shadow-xl
    z-50
    animate-bounce"
  >
    {SuccessMessage}
  </div>
)}
        </div>

      </div>

    </div>
  );
}

export default App;