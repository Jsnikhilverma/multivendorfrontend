import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const CatalogPdf = () => {
  const { id } = useParams();
  const printRef = useRef();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);  
  useEffect(() => {
    if (!id) return;

    // Fetch products by vendor from API
    fetch(`${import.meta.env.VITE_BASE_URL}products/by-vendor/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products.length > 0) {
          // Set products
          setProducts(data.products);
          console.log("Fetched products:", data.products);
          
          // Extract vendor details from first product
          setVendor(data.products[0].vendorId);
        } else {
          setVendor(null);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, [id]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Vendor Catalog</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #222; }
            h2, h3 { margin-bottom: 10px; }
            p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            img { max-width: 80px; max-height: 80px; object-fit: contain; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!vendor) return <p>Loading vendor and products...</p>;

  return (
    <div className="p-6">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Print Catalog
      </button>

      <div ref={printRef}>
        <h2 className="text-2xl text-bold mb-5">Vendor Details</h2>
        <p>
          <strong>Name:</strong> {vendor.name}
        </p>
        <p>
          <strong>Email:</strong> {vendor.email}
        </p>
        <p>
          <strong>Phone:</strong> {vendor.phone}
        </p>

        <h3 className="text-2xl text-bold mb-5 mt-5">Product List</h3>
       <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-xl overflow-hidden border border-gray-200">
  <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
    <tr>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">#</th>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Product</th>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Price</th>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Category</th>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Description</th>
      <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Image</th>
      {/* <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider">Stock</th> */}
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {products.map((p, index) => (
      <tr key={p._id} className="hover:bg-gray-50 transition duration-200">
        <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{p.name}</td>
        <td className="px-4 py-3 text-sm text-emerald-600 font-semibold">₹{p.price}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{p.description}</td>
        <td className="px-4 py-3">
          {p.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMG}${p.imageUrl}`}
              alt={p.name}
              className="h-12 w-12 object-cover rounded-full border border-gray-300 shadow-sm"
            />
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </td>
        {/* <td className="px-4 py-3 text-sm text-gray-700">{p.stock ?? "N/A"}</td> */}
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default CatalogPdf;
