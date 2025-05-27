import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Typography,
  Tooltip,

} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import Toaster, { showSuccessToast, showErrorToast } from "../../../components/Toaster";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { EllipsisVertical, Eye, TrashIcon } from "lucide-react";
// import { set } from "lodash";

const Audiobooks = () => {
  const token = Cookies.get("token");
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storename, setStorename] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [creating, setCreating] = useState(false);

  // Track editing vendor ID (null means creating new)
  const [editingVendorId, setEditingVendorId] = useState(null);

  // Fetch vendors (audiobooks) list
  const fetchAudiobooks = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}get-vendors?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAudiobooks(data.vendors || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        showErrorToast("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchAudiobooks(currentPage);
  }, [fetchAudiobooks, currentPage]);

  // Create new vendor
  const handleCreate = async () => {
    if (!name || !email || !storename || !phone || !address) {
      showErrorToast("All fields are required.");
      return;
    }

    try {
      setCreating(true);
      const body = {
        name,
        company: storename,
        phone,
        email,
        address,
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}vendors/create`, body, {
        headers: { "Content-Type": "application/json" },
      });

      showSuccessToast("Vendor created successfully");
      handleCloseModal();
      fetchAudiobooks(currentPage);
    } catch (err) {
      console.error("Error creating vendor:", err);
      showErrorToast("Failed to create vendor");
    } finally {
      setCreating(false);
    }
  };

  // Update existing vendor
  const handleUpdate = async () => {
    if (!name || !email || !storename) {
   setOpenModal(true)
      return;
    }

    try {
      setCreating(true);
      const body = {
        name,
        email,
        company: storename, // backend expects 'company' for store name
      };

      await axios.put(`${import.meta.env.VITE_BASE_URL}vendors/update/${editingVendorId}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccessToast("Vendor updated successfully");
      handleCloseModal();
      fetchAudiobooks(currentPage);
    } catch (err) {
      console.error("Error updating vendor:", err);
      showErrorToast("Failed to update vendor");
    } finally {
      setCreating(false);
    }
  };

  // Delete vendor
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}vendors/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccessToast("Vendor deleted");
      fetchAudiobooks(currentPage);
    } catch (err) {
      console.error("Error deleting vendor:", err);
      showErrorToast("Failed to delete vendor");
    }
  };

  // Open modal with vendor data for editing
  const handleEdit = async (id) => {
    try {
      setOpenModal(true);
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}get-vendor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(data.name || "");
      setEmail(data.email || "");
      setStorename(data.company || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setPassword(""); // password not editable here

      setEditingVendorId(id);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      showErrorToast("Failed to load vendor data");
    } finally {
      setLoading(false);
    }
  };

  // Reset and close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingVendorId(null);
    setName("");
    setEmail("");
    setPassword("");
    setStorename("");
    setPhone("");
    setAddress("");
  };

  // Table columns
  const columns = [
    { key: "name", label: "Name", render: (row) => row.name },
    { key: "company", label: "Company", render: (row) => row.company },
    { key: "email", label: "Email", render: (row) => row.email },
    { key: "phone", label: "Phone", render: (row) => row.phone || "N/A" },
    // {
    //   key: "logo",
    //   label: "Logo",
    //   render: (row) => (
    //     <img src={row.logo} alt="logo" className="h-12 w-12 rounded-full object-cover" />
    //   ),
    // },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <button onClick={() => navigate(`/audio-detail/${row._id}`)}>
              <Eye className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row._id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
              <EllipsisVertical className="h-5 w-5 text-gray-600" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {["Edit", "Catalogs", "Products", "Customers"].map((label) => (
                  <Menu.Item key={label}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          if (label === "Edit") {
                            handleEdit(row._id);
                          } else if (label === "Catalogs") {
                            navigate(`/catelog/${row._id}`);
                          } else if (label === "Products") {
                            navigate(`/product-package-detail/${row._id}`);
                          } else if (label === "Customers") {
                            navigate(`/user-detail/${row._id}`);
                          }
                        }}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        {label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
 {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-gray-400">
      <h3 className="text-lg font-bold mb-4">
        {editingVendorId ? "Edit Vendor" : "Add a New Vendor"}
      </h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* {!editingVendorId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )} */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={storename}
            onChange={(e) => setStorename(e.target.value)}
          />
        </div>

     
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 text-red-500 hover:text-red-700"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={editingVendorId ? handleUpdate : handleCreate}
          disabled={creating}
        >
          {creating
            ? editingVendorId
              ? "Updating..."
              : "Creating..."
            : editingVendorId
            ? "Update"
            : "Create"}
        </button>
      </div>
    </div>
  </div>
)}


      <Card className="border-2 border-gray-600 p-5">
        <Toaster />

        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Vendors
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage all Vendors
              </Typography>
            </div>
            <Button className="bg-blue-500" onClick={() => setOpenModal(true)}>
              Add New Vendor
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          {loading ? (
            <div className="flex justify-center p-20">
              <Spinner color="blue" />
            </div>
          ) : (
            <CustomTable
              columns={columns}
              data={audiobooks}
              emptyMsg="No vendors found"
              itemsPerPage={5}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing {audiobooks.length} out of {totalPages * 5} results
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              color="blue-gray"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              color="blue-gray"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Audiobooks;
