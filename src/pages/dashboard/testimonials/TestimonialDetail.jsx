import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,

  Typography,
  Spinner,
} from "@material-tailwind/react";

const  TestimonailDetail = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  const [audiobook, setAudiobook] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudiobookById = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/testimonial/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAudiobook(data.testimonial);
      } catch (error) {
        console.error("Failed to fetch audiobook details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobookById();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="text-center mt-10 text-red-500">
        Audiobook not found.
      </div>
    );
  }



const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
};

return (
    <div className="max-w-md mx-auto mt-8 px-4">
        <Card className="shadow-lg ">

            <div className="">
                {/* Image Section */}
                <div>
                    <img
                        src={`${import.meta.env.VITE_BASE_URL_IMAGE}${audiobook.image}`}
                        alt={audiobook.title}
                        className="h-full w-full object-cover rounded-t-xl md:rounded-xl"
                    />
                </div>

                {/* Content Section */}
                <CardBody className="md:w-1/2 p-6 space-y-4">
                    <Typography variant="h4" color="blue-gray">
                        {audiobook.title}
                    </Typography>
                    <Typography color="blue-gray" className="text-lg font-semibold">
                        {audiobook.name}
                    </Typography>
                    <Typography color="green" className="text-xl font-semibold">
                        {audiobook.price}
                    </Typography>
                    <Typography color="gray" className="text-lg">
                        {showFullDescription
                            ? audiobook.description
                            : `${audiobook.description.slice(0, 100)}...`}
                    </Typography>
                    <button
                        onClick={toggleDescription}
                        className="text-blue-500 underline mt-2"
                    >
                        {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                </CardBody>
            </div>
        </Card>
    </div>
);
};

export default TestimonailDetail;
