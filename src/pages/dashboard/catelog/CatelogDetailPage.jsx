import { Navigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  Typography,
  Button,

} from "@material-tailwind/react";
import { toast, Toaster } from "react-hot-toast";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

const CatelogDetailPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");

const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const printRef = useRef();

  useEffect(() => {
    const fetchProductsByVendor = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}products/by-vendor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch product details", error);
        toast.error("Failed to fetch product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByVendor();
  }, [id, token]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description);
    setOpenModal(true);
  };

  const handlePreviewPDF = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        const element = printRef.current;
        
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true);
        
        // Add print-specific styles
        const style = document.createElement('style');
        style.innerHTML = `
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .page-break {
              page-break-after: always;
            }
            .no-break {
              page-break-inside: avoid;
            }
          }
        `;
        clonedElement.appendChild(style);

        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `luxury-catalog-${new Date().toISOString().slice(0,10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf()
          .set(opt)
          .from(clonedElement)
          .toPdf()
          .get('pdf')
          .then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.setTextColor(150);
              pdf.text(
                `Page ${i} of ${totalPages}`,
                pdf.internal.pageSize.getWidth() - 1.5,
                pdf.internal.pageSize.getHeight() - 0.5
              );
            }
          })
          .save()
          .then(() => resolve());
      }),
      {
        loading: 'Generating luxury catalog...',
        success: 'Catalog downloaded successfully!',
        error: 'Failed to generate catalog',
      }
    );
  };

  const handlePreviewOnly = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        const element = printRef.current;
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: 'luxury-catalog-preview.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait'
          },
        };

        html2pdf()
          .set(opt)
          .from(element)
          .toPdf()
          .output('blob')
          .then((pdfBlob) => {
            const pdfURL = URL.createObjectURL(pdfBlob);
            window.open(pdfURL, '_blank');
            resolve();
          })
          .catch(reject);
      }),
      {
        loading: 'Preparing catalog preview...',
        success: 'Preview ready!',
        error: 'Failed to generate preview',
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <Typography variant="h6" className="mt-4 text-gray-700">
            Loading Luxury Collection...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 font-sans bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-between items-center mb-10">
        <Typography variant="h5" className="text-2xl font-semibold text-gray-800">
          All Products
        </Typography>
       
        <div className="flex gap-3">
          <Button
            className="bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-lg"
            onClick={handlePreviewOnly}
          >
            <Download size={18} />
            Preview PDF
          </Button>
          <Button
            className="bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-lg"
            onClick={() => window.location.href = `/catelogpdf/${id}`}
          >
            Next Page
          </Button>
          
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <Typography variant="h4" className="text-gray-700 mb-4">
              No products found in this collection
            </Typography>
            <Typography className="text-gray-500 mb-6">
              Our artisans are currently crafting new exclusive pieces. Please check back soon.
            </Typography>
            <Button className="bg-amber-700 text-white">
              Notify Me When Available
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <Card
              key={product._id}
              className="shadow-xl rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden bg-gray-100">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL_IMG}${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                    PREMIUM
                  </div>
                </div>

                <div className="md:w-3/5 p-8 bg-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Typography variant="h3" className="text-2xl font-bold text-gray-900 mb-1">
                        {product.name}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                        <Typography className="text-sm font-medium text-gray-500 uppercase">
                          {product.category}
                        </Typography>
                      </div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-lg">
                      <Typography className="text-amber-800 font-bold text-xl">
                        ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                      </Typography>
                    </div>
                  </div>

                  <div className="mb-8">
                    <Typography className="text-gray-700 leading-relaxed">
                      {product.description}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatelogDetailPage;