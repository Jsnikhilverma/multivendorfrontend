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
    fetch(`http://localhost:4000/api/products/by-vendor/${id}`)
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
        <h2>Vendor Details</h2>
        <p>
          <strong>Name:</strong> {vendor.name}
        </p>
        <p>
          <strong>Email:</strong> {vendor.email}
        </p>
        <p>
          <strong>Phone:</strong> {vendor.phone}
        </p>

        <h3>Product List</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.category}</td>
                <td>{p.description}</td>
                <td>
                  {p.imageUrl ? (
                    <img
                      src={`http://localhost:4000${p.imageUrl}`}
                      alt={p.name}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{p.stock ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogPdf;
