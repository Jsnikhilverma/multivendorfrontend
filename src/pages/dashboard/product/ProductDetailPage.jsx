import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  Typography,
  Spinner,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast, Toaster } from "react-hot-toast";
import { Crown } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");

  const [audiobook, setAudiobook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchAudiobookById = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudiobook(data.product);
      } catch (error) {
        console.error("Failed to fetch product details", error);
        toast.error("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobookById();
  }, [id, token]);

  const handleEdit = () => {
    setName(audiobook.name || "");
    setPrice(audiobook.price || "");
    setCategory(audiobook.category || "");
    setDescription(audiobook.description || "");
    setImage(null);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}products/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAudiobook(response.data.product);
      toast.success("Product updated successfully");
      setOpenModal(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="text-center mt-10 text-red-500">Product not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 font-sans">
      <Toaster />
      <Card className="shadow-lg rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Image Section */}
          <div className="w-full md:w-1/3">
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMG}${audiobook.imageUrl}`}
              alt={audiobook.name}
              className="rounded-xl object-cover w-full h-64 border border-gray-200 shadow-sm hover:scale-105 transition-transform"
            />
          </div>

          {/* Right Details Section */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex items-center justify-between">
              <Typography className="text-2xl font-bold text-gray-800">
                {audiobook.name}
              </Typography>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
                <Crown className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            {/* Price */}
            <div>
              <Typography className="text-sm font-medium text-gray-500 uppercase mb-1">
                Price
              </Typography>
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold 
          ${audiobook.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                ₹{audiobook.price}
              </span>
            </div>

            {/* Category */}
            <div>
              <Typography className="text-sm font-medium text-gray-500 uppercase mb-1">
                Category
              </Typography>
              <Typography className="text-base font-medium text-gray-700">
                {audiobook.category}
              </Typography>
            </div>

            {/* Description */}
            <div>
              <Typography className="text-sm font-medium text-gray-500 uppercase mb-1">
                Description
              </Typography>
              <Typography className="text-base text-gray-600 leading-relaxed">
                {audiobook.description}
              </Typography>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-6 space-x-4">
        <Button
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
          onClick={handleEdit}
        >
          ✏️ Edit Product
        </Button>
      </div>

      {/* Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300">
            <h3 className="text-xl font-bold mb-6 text-indigo-600">
              Edit Product
            </h3>
            <div className="flex flex-col gap-4">
              <label className="text-sm text-gray-500">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="text-sm text-gray-500">Price</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label className="text-sm text-gray-500">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <label className="text-sm text-gray-500">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="text-sm text-gray-500">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="text"
                color="red"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
