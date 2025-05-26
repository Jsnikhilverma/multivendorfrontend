import { useState, useEffect, useCallback } from "react";
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
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { useParams } from "react-router-dom";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function UsersDetail() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");

    const navigate = useNavigate();

  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleOpenModal = (user) => {
    setEditUser({ ...user });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/users/update/${editUser.id}`,
        {
          name: editUser.name,
          phone: editUser.phone,
          email: editUser.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === editUser.id ? { ...lead, ...editUser } : lead
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const fetchLeads = useCallback(
    async () => {
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/by-vendor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLeads(data.users);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, id]
  );

  useEffect(() => {
    if (token) fetchLeads(currentPage);
  }, [token, currentPage, fetchLeads]);

  const deleteLead = async (id) => {
    try {
      console.log(id,"serdtfyghj");
      
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}users/delete/${id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ) 
      setLeads(leads.filter((lead) => lead.id !== id));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const columns = [
    {
      key: "profilePic",
      label: "Profile",
      render: (row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {row.profilePic ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}${row.profilePic}`}
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
      render: (row) => <div>{row.name || "N/A"}</div>,
      width: "w-48",
    },
    {
      key: "phone",
      label: "Mobile",
      render: (row) => <div>{row.phone || "N/A"}</div>,
      width: "w-40",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <div>{row.email || "N/A"}</div>,
      width: "w-60",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="Edit">
            {/* <button onClick={() => handleOpenModal(row)}> */}
            <button onClick={() => navigate(`/user/${row._id}`)}>
              <EyeIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Edit">
            <button onClick={() => handleOpenModal(row)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => deleteLead(row._id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-28",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              User List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View the current active Users
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={leads} />
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

      {/* Edit Modal */}
      {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg w-full max-w-md border-2 border-gray-400">
      <h3 className="text-lg font-bold mb-4">Edit User</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded-md p-2"
            value={editUser?.name || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="text"
            name="phone"
            className="w-full border border-gray-300 rounded-md p-2"
            value={editUser?.phone || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={editUser?.email || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 text-red-500 hover:text-red-700"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleSaveChanges}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </Card>
  );
}

export default UsersDetail;
