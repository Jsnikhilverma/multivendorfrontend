import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast, Toaster } from "react-hot-toast";
import { Crown, Mail, Phone } from 'lucide-react';

const UserDetailPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");

  const [audiobook, setAudiobook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchAudiobookById = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudiobook(data.user);
      } catch (error) {
        console.error("Failed to fetch audiobook details", error);
        toast.error("Failed to fetch vendor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobookById();
  }, [id, token]);

  const handleEdit = () => {
    setName(audiobook.name || "");
    setCompany(audiobook.company || "");
    setPhone(audiobook.phone || "");
    setEmail(audiobook.email || "");
    setAddress(audiobook.address || "");
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}users/update/${id}`,
        { name, company, phone, email, address },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAudiobook(response.data.user);
      toast.success("Vendor updated successfully");
      setOpenModal(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update vendor");
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
      <div className="text-center mt-10 text-red-500">Vendor not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 font-sans">
      <Toaster />
     <Card className="shadow-3xl rounded-3xl p-8 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 transform transition-all hover:shadow-4xl hover:-translate-y-1">
  <div className="flex items-center justify-between mb-8">
    <Typography variant="h3" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
      User Profile
    </Typography>
    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
      <Crown className="h-5 w-5 text-amber-500" />
    </div>
  </div>

  <CardBody className="space-y-8">
    <div className="border-b border-indigo-100 pb-6">
      <Typography className="text-xs uppercase tracking-wider font-medium text-indigo-400 mb-1">Name</Typography>
      <Typography className="text-xl font-semibold text-gray-800">{audiobook.name}</Typography>
    </div>

    {/* <div className="border-b border-indigo-100 pb-6">
      <Typography className="text-xs uppercase tracking-wider font-medium text-indigo-400 mb-1">Status</Typography>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-opacity-10 text-sm font-semibold tracking-wide 
        ${audiobook.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
        {audiobook.status ? (
          <>
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
            Active
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
            Inactive
          </>
        )}
      </div>
    </div> */}

    {/* <div className="border-b border-indigo-100 pb-6">
      <Typography className="text-xs uppercase tracking-wider font-medium text-indigo-400 mb-1">Company</Typography>
      <Typography className="text-xl font-semibold text-gray-800">{audiobook.company}</Typography>
    </div> */}

    <div className="border-b border-indigo-100 pb-6">
      <Typography className="text-xs uppercase tracking-wider font-medium text-indigo-400 mb-1">Email</Typography>
      <div className="flex items-center">
        <Mail className="h-5 w-5 text-indigo-400 mr-2" />
        <Typography className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors">
          {audiobook.email}
        </Typography>
      </div>
    </div>

    <div>
      <Typography className="text-xs uppercase tracking-wider font-medium text-indigo-400 mb-1">Phone</Typography>
      <div className="flex items-center">
        <Phone className="h-5 w-5 text-indigo-400 mr-2" />
        <Typography className="text-xl font-medium text-gray-800">{audiobook.phone}</Typography>
      </div>
          </div>
  </CardBody>
</Card>

      <div className="flex justify-end mt-6 space-x-4">
        <Button
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
          onClick={handleEdit}
        >
          ✏️ Edit User
        </Button>
        {/* <Button
          className={`${
            audiobook.status
              ? "bg-gradient-to-r from-red-500 to-pink-500"
              : "bg-gradient-to-r from-green-500 to-emerald-500"
          } text-white shadow-lg`}
          onClick={handleToggleActive}
        >
          {audiobook.status ? "Deactivate" : "Activate"}
        </Button> */}
      </div>

      {/* Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300">
            <h3 className="text-xl font-bold mb-6 text-indigo-600">Edit User</h3>
            <div className="flex flex-col gap-4">
               <label className="text-sm text-gray-500 peer-focus:text-indigo-600 peer-focus:font-semibold">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer"
              />

              <label className="text-sm text-gray-500 peer-focus:text-indigo-600 peer-focus:font-semibold">
                Email
              </label>
             
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer"
              />

              <label className="text-sm text-gray-500 peer-focus:text-indigo-600 peer-focus:font-semibold">
                Phone
              </label>
              
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="peer"
              />


               {/* <label className="text-sm text-gray-500 peer-focus:text-indigo-600 peer-focus:font-semibold">
                Company
              </label>
              
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="peer"
              /> */}
{/* 
              <label className="text-sm text-gray-500 peer-focus:text-indigo-600 peer-focus:font-semibold">
                Address
              </label>
             
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="peer"
              /> */}
              
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="text" color="red" onClick={() => setOpenModal(false)}>
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

export default UserDetailPage;
