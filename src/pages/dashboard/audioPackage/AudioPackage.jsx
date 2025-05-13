import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "../../../components/Toaster";
import CustomTable from "../../../components/CustomTable";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AudioPackage = () => {
  const token = Cookies.get("token");
  const [audiobooks, setAudiobooks] = useState([]);
  const [audioPackage, setAudioPackage] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate(); // Initialize navigate

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [creating, setCreating] = useState(false);

  // const uploadFile = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file); // fixed key here

  //   try {
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/audio-upload`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     return data?.url;
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     throw new Error("Failed to upload");
  //   }
  // };

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

  const fetchAudiobooks = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/audiobook?page=${page}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAudiobooks(data.audiobooks || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
        showErrorToast("Failed to fetch audiobooks");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );
  const fetchAudioPackage = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/pack?page=${page}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAudioPackage(data.packs || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
        showErrorToast("Failed to fetch audiobooks");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchAudiobooks(currentPage);
    fetchAudioPackage(currentPage);
  }, [fetchAudiobooks, currentPage, fetchAudioPackage]);

  const handleCreate = async () => {
    if (!title || !description || !imageFile || !audioFile || !price) {
      showErrorToast("All fields are required.");
      return;
    }

    try {
      setCreating(true);

      // Upload image
      // const imageUrl = await uploadFile(imageFile);

      // // Upload audio
      // const audioUrl = await uploadFile(audioFile);

      // Send the URLs in the create audiobook request
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/pack`,
        {
          title,
          description,
          price: parseFloat(price),
          discountedPrice: parseFloat(discountPrice),
          image: imageFile,
          audioBookIds: audioFile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast("Audiobook created successfully");
      setOpenModal(false);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setAudioFile([]);
      setPrice("");
      fetchAudioPackage(currentPage);
    } catch (err) {
      console.error("Error creating audiobook:", err);
      showErrorToast("Failed to create audiobook");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/pack/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("Audiobook deleted");
      fetchAudioPackage(currentPage);
    } catch (err) {
      console.error("Error deleting audiobook:", err);
      showErrorToast("Failed to delete audiobook");
    }
  };

  const handleEdit = (id) => {
    // Navigate to the edit page with the audiobook ID
    navigate(`/audio-package-detail/${id}`);
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.image}`}
          alt={row.title}
          className="w-16 h-16 rounded"
        />
      ),
    },
    { key: "title", label: "Title", render: (row) => `${row.title}` },

    { key: "price", label: "Price", render: (row) => `${row.price}` },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip content="detail">
            <button onClick={() => handleEdit(row.id)}>
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
              Audiobooks Package
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage all Audiobooks packages here.
            </Typography>
          </div>
          <Button className="bg-blue-500" onClick={() => setOpenModal(true)}>
            Add Audiobook Package
          </Button>
        </div>
      </CardHeader>

      <Dialog open={openModal} handler={() => setOpenModal(false)} size="md">
        <DialogHeader>Add a New Audiobook</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4 h-[500px] p-2 overflow-y-auto">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
                    showErrorToast("Failed to upload image", error);
                  }
                }
              }}
              icon={<PhotoIcon className="h-5 w-5 text-gray-400" />}
            />

            <label className="text-sm text-gray-700 font-medium">
              Select Audiobooks
            </label>
            <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
              {audiobooks.map((audio) => (
                <div key={audio.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`audio-${audio.id}`}
                    value={audio.id}
                    checked={audioFile.includes(audio.id)}
                    onChange={(e) => {
                      const id = audio.id;
                      setAudioFile(
                        (prev) =>
                          e.target.checked
                            ? [...prev, id] // add
                            : prev.filter((item) => item !== id) // remove
                      );
                    }}
                  />
                  <label htmlFor={`audio-${audio.id}`} className="text-sm font-semibold">
                    {audio.title}
                  </label>
                </div>
              ))}
            </div>

            <Input
              label="Price"
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />

            <Input
              label="Discounted Price"
              value={discountPrice}
              type="number"
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={audioPackage} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <IconButton
              key={i + 1}
              variant="text"
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              disabled={currentPage === i + 1}
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

export default AudioPackage;
