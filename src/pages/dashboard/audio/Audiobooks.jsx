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
  Spinner,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import Toaster, { showSuccessToast, showErrorToast } from "../../../components/Toaster";
import CustomTable from "../../../components/CustomTable";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Audiobooks = () => {
  const token = Cookies.get("token");
  const [audiobooks, setAudiobooks] = useState([]);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [name, setTitle] = useState("");
  const [email, setDescription] = useState("");
  const [password, setPrice] = useState("");
  const [storename, setStorename] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchAudiobooks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}get-vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAudiobooks(data.vendors || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      showErrorToast("Failed to fetch audiobooks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAudiobooks(currentPage);
  }, [fetchAudiobooks, currentPage]);

  const handleCreate = async () => {
    console.log('1');
    
    if (!name || !email || !password || !storename) {
      showErrorToast("All fields are required.");
      return;
    }
    console.log(2);
    

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("storename", storename);
      formData.append("logo", "https://res.cloudinary.com/duajvpvod/image/upload/v1747053682/shop-logo-icon-vector_376476-102_gjwzgt.jpg"); // use file object
      console.log(3);
      
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}add-vendor`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res, 'res');
      

      showSuccessToast("Vendor created successfully");
      setOpenModal(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setStorename("");
      setLogo("");
      fetchAudiobooks(currentPage);
    } catch (err) {
      console.error("Error creating vendor:", err);
      showErrorToast("Failed to create vendor");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/audiobook/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccessToast("Vendor deleted");
      fetchAudiobooks(currentPage);
    } catch (err) {
      console.error("Error deleting vendor:", err);
      showErrorToast("Failed to delete vendor");
    }
  };

  const handleEdit = (id) => {
    navigate(`/audio-detail/${id}`);
  };

  const columns = [
    { key: "name", label: "Name", render: (row) => row.name },
    { key: "storeName", label: "Storename", render: (row) => row.storename },
    { key: "email", label: "Email", render: (row) => row.email },
    { key: "url", label: "URL", render: (row) => row.url },
    {
      key: "logo",
      label: "Logo",
      render: (row) => (
        <img src={row.logo} alt="logo" className="h-12 w-12 rounded-full object-cover" />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip content="Details">
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
              Venders
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Manage all Venders
            </Typography>
          </div>
          <Button className="bg-blue-500" onClick={() => setOpenModal(true)}>
            Add Vender
          </Button>
        </div>
      </CardHeader>

      <Dialog open={openModal} handler={() => setOpenModal(false)}>
        <DialogHeader>Add a New Vender</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
  <Input
    label="Name"
    value={name}
    onChange={(e) => setTitle(e.target.value)}
    className="border border-black text-xl p-3 rounded-md"
  />
  <Input
    label="Email"
    value={email}
    onChange={(e) => setDescription(e.target.value)}
    className="border border-black text-xl p-3 rounded-md"
  />
  <Input
    label="Password"
    value={password}
    onChange={(e) => setPrice(e.target.value)}
    type="password"
    className="border border-black text-xl p-3 rounded-md"
  />
  <Input
    label="Store Name"
    value={storename}
    onChange={(e) => setStorename(e.target.value)}
    className="border border-black text-xl p-3 rounded-md"
  />
</div>

        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500" onClick={() => handleCreate()} disabled={creating}>
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
          <CustomTable columns={columns} data={audiobooks} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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
        <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Audiobooks;
