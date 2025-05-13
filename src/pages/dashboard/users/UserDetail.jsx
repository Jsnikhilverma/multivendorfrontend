import  { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@material-tailwind/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
 import Toaster, {
    showSuccessToast,
    showErrorToast,
  } from "../../../components/Toaster";


const UserDetail = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    profilePic: null,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const token = Cookies.get("token");

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
        showErrorToast("Failed to upload image");
        throw new Error("Failed to upload");
      }
    };
  


    const fetchUser = useCallback(async () => {
      try {
      
        if (!token) {
          console.error("Admin token is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.user) {
          const user = response.data.user;
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            type: user.type || "",
            profilePic: user.profilePic || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        showErrorToast("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }, [id, token]);


    useEffect(() => {

    fetchUser();
  }, [id, token,fetchUser]); // Fetch user data when component mounts or id changes

  //  handle form data change

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Admin token is missing.");
        return;
      }

      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.phone) payload.phone = formData.phone;
      if (imageFile) payload.image = imageFile; // Assuming this is just a string or path

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/user/profile/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // alert("User profile updated successfully!");
        showSuccessToast("User profile updated successfully!");
        fetchUser(); // Refresh user data after update
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update user profile");
      // alert("Failed to update user profile.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
     
      if (!token) {
        console.error("Admin token is missing.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

         axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/user/password/${id}`,
        {
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
     
      );
     
      
        // alert("Password updated successfully!");
        showSuccessToast("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");

    
    } catch (error) {
      console.error("Error updating password:", error);
      // alert("Failed to update password.");
      showErrorToast("Failed to update password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <>
    <Toaster />
    <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            disabled
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Profile Image Preview */}
        <div className="sm:col-span-2 mt-4">
          <label className="block font-medium mb-1">Profile Picture</label>
          <img
            src={
              formData.profilePic
                ? `${import.meta.env.VITE_BASE_URL_IMAGE}${formData.profilePic}`
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        {/* File Upload */}
        <div className="sm:col-span-2">
          <label className="block font-medium mb-1">
            Upload New Profile Picture
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
                    console.log("Failed to upload image", error);
                  }
                }
              }}
              icon={<PhotoIcon className="h-5 w-5 text-gray-400" />}
            />
        </div>

        <div className="sm:col-span-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
    {/* update password form */}
     <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md bg-white mt-8">
      <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
      <form
        onSubmit={handleUpdatePassword}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        
      
        {/* New Password */}
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="sm:col-span-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UserDetail;
