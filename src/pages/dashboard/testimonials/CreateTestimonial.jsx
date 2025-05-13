import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Spinner,
  Textarea,
  Tooltip,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import CustomTable from "../../../components/CustomTable";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "../../../components/Toaster";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

function CreateTestimonial() {
  const [Testimonial, setTestimonial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file

  const navigate = useNavigate();

  const token = Cookies.get("token");
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const uploadImgFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // fixed key here
  
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data?.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload");
    }
  };


  const fetchTestimonial = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/testimonial?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Testimonial:", data.testimonials);
        setTestimonial(data.testimonials|| []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching Testimonial:", error);
        showErrorToast("Failed to fetch Testimonial");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchTestimonial(currentPage);
  }, [fetchTestimonial, currentPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/testimonial/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Testimonial deleted");
      fetchTestimonial(currentPage);
    } catch (error) {
      console.error("Error deleting Testimonial:", error);
      showErrorToast("Failed to delete Testimonial");
    }
  };

  const handleCreateTestimonial = async () => {
    if (!title.trim() || !description.trim()) {
      showErrorToast("Both question and Description are required.");
      return;
    }

    try {
      setCreating(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/testimonial`,
        { name:title, image:imageFile, description:description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessToast("Testimonial created");
      setTitle("");
      setDescription("");
      setImageFile(null); // Reset the image file state
      setOpenModal(false);
      fetchTestimonial(currentPage);
    } catch (error) {
      console.error("Error creating Testimonial:", error);
      showErrorToast("Failed to create Testimonial");
    } finally {
      setCreating(false);
    }
  };

  const handleView = (id) => {
    navigate(`/testimonials-detail/${id}`);
  };
  

  const columns = [
    {
      key: "image",
      label: "image",
      render: (row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {row.image ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.image}`}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              N/A
            </div>
          )}
        </div>
      ),
      width: "w-20",
    },
    {
      key: "name",
      label: "Name",
      render: (row) => <div>{row.name}</div>,
    },
    {
      key: "description", 
      label: "Description",
      render: (row) => <div>{row.description}</div>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip content="Detail">
            <button onClick={() => handleView(row.id)}>
              <Eye className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
        <Tooltip content="Delete">
          <button onClick={() => handleDelete(row.id)}>
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
              Testimonial List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View all Testimonial and create new ones
            </Typography>
          </div>
          <Button onClick={handleOpenModal} className="bg-blue-500">
            Add Testimonial
          </Button>
        </div>
      </CardHeader>

      <Dialog open={openModal} handler={handleOpenModal}>
        <DialogHeader>Add a New Testimonial</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
          <label className="text-sm text-gray-700 font-medium">
              Upload Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    const imageUrl = await uploadImgFile(file);
                    setImageFile(imageUrl);
                  } catch (error) {
                    showErrorToast("Failed to upload image",error);
                  }
                }
              }}
              icon={<PhotoIcon className="h-5 w-5 text-gray-400" />}
            />
            <Input
              label="Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenModal}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleCreateTestimonial();
              setOpenModal(false);
            }}
            disabled={creating}
            className="bg-blue-500"
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Testimonial Table */}
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={Testimonial} />
        )}
      </CardBody>

      {/* Pagination */}
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}
              >
                1
              </IconButton>
              {currentPage > 4 && <p>...</p>}
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <IconButton
                key={page}
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}
              >
                {page}
              </IconButton>
            );
          })}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </IconButton>
            </>
          )}
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
}

export default CreateTestimonial;
