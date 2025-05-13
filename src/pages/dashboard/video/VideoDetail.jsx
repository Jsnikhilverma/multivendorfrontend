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

const VideoDetail = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  const [video, setVideo] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/video/details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVideo(data.video);
      } catch (error) {
        console.error("Failed to fetch video details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoById();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center mt-10 text-red-500">
        Video not found.
      </div>
    );
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Convert YouTube link to embeddable format
  const getYouTubeEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(video.video);

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Card className="shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={video.image}
              alt={video.title}
              className="h-full w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            />
          </div>

          {/* Content Section */}
          <CardBody className="md:w-1/2 p-6 space-y-4">
            <Typography variant="h4" color="blue-gray">
              {video.title}
            </Typography>

            {embedUrl ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 rounded-md"
                ></iframe>
              </div>
            ) : (
              <Typography color="red">Invalid YouTube link</Typography>
            )}

            <Typography color="gray" className="text-lg">
              {showFullDescription
                ? video.description
                : `${video.description.slice(0, 100)}...`}
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

export default VideoDetail;
