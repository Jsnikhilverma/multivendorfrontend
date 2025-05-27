import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Eye } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";
import CustomTable from "../../../components/CustomTable";

const AudioPackageDetail = () => {
  const token = Cookies.get("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [creating, setCreating] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const IMG_BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setImageFile(null);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}products/by-vendor/${id}?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(data.products || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      showErrorToast("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, token, id, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async () => {
    if (!name || !category || !price) {
      showErrorToast("Please fill required fields: name, category, and price.");
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}products/add/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccessToast("Product created successfully");
      resetForm();
      setOpenModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Create failed:", error);
      showErrorToast("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  // Updated handleDelete with your API endpoint
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${BASE_URL}products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccessToast("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      showErrorToast("Failed to delete product");
    }
  };

  const handleEdit = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={
            row.imageUrl
              ? `${IMG_BASE_URL}${row.imageUrl}`
              : "/placeholder-image.png"
          }
          alt={row.name}
          className="w-16 h-16 rounded object-cover"
        />
      ),
    },
    { key: "name", label: "Name", render: (row) => row.name || "N/A" },
    { key: "category", label: "Category", render: (row) => row.category || "N/A" },
    {
      key: "price",
      label: "Price",
      render: (row) =>
        typeof row.price === "number" ? `$${row.price.toFixed(2)}` : "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip content="View Details">
            <button onClick={() => handleEdit(row._id)}>
              <Eye className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row._id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Toaster />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Vendor Products
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage all products for this vendor
            </Typography>
          </div>
          <Button className="bg-blue-500" onClick={() => setOpenModal(true)}>
            Add Product
          </Button>
        </div>
      </CardHeader>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add a New Product</h3>
              <button
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                className="text-xl font-bold text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name *"
                className="border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Category *"
                className="border p-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price *"
                className="border p-2 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="border p-2 rounded"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                className="px-4 py-2 text-red-500"
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={products} />
        )}
      </CardBody>

      {/* Pagination */}
      <CardFooter className="flex justify-between items-center py-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <IconButton
              key={i + 1}
              variant={currentPage === i + 1 ? "filled" : "text"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </IconButton>
          ))}
        </div>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AudioPackageDetail;
