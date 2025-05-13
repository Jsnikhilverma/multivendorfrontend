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
} from "@material-tailwind/react";

const AudioPackageDetail = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  const [pack, setPack] = useState(null);
  const [audioBooks, setAudioBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const fetchPackDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/pack/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPack(data.pack);
        setAudioBooks(data.audioBooks);
        if (data.audioBooks.length > 0) {
          setCurrentAudio(data.audioBooks[0]);
        }
      } catch (error) {
        console.error("Failed to fetch package details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="text-center mt-10 text-red-500">
        Audio package not found.
      </div>
    );
  }

  const calculateSavings = () => {
    if (pack.price && pack.discountedPrice) {
      const savings = pack.price - pack.discountedPrice;
      const savingsPercentage = (savings / pack.price) * 100;
      return savingsPercentage.toFixed(0);
    }
    return 0;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Package Header Card */}
      <Card className="shadow-lg mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Package Image */}
          <div className="md:w-1/3">
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}${pack.image}`}
              alt={pack.title}
              className="h-full w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            />
          </div>

          {/* Package Details */}
          <CardBody className="md:w-2/3 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <Typography variant="h3" color="blue-gray" className="font-bold">
                {pack.title}
              </Typography>
              {pack.free ? (
                <div className="bg-green-500 text-white px-4 py-1 rounded-full">
                  Free
                </div>
              ) : null}
            </div>

            <Typography color="gray" className="text-lg">
              {pack.description}
            </Typography>

            <div className="flex items-center space-x-4">
              {!pack.free && (
                <>
                  <Typography color="green" className="text-2xl font-bold">
                    ${pack.discountedPrice}
                  </Typography>
                  <Typography color="gray" className="text-lg line-through">
                    ${pack.price}
                  </Typography>
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    Save {calculateSavings()}%
                  </div>
                </>
              )}
            </div>

            <div className="pt-4">
              <Typography variant="h6" color="blue-gray">
                Package Includes:
              </Typography>
              <Typography color="gray">
                {audioBooks.length} audiobooks
              </Typography>
            </div>

            {/* <Button 
              color="blue" 
              className="mt-4"
              fullWidth
            >
              {pack.free ? "Get Free Package" : "Purchase Package"}
            </Button> */}
          </CardBody>
        </div>
      </Card>

      {/* Current Playing Audiobook Section */}
      {currentAudio && (
        <Card className="shadow-lg mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4">
              <img
                src={`${import.meta.env.VITE_BASE_URL_IMAGE}${currentAudio.image}`}
                alt={currentAudio.title}
                className="h-full w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
            </div>
            <CardBody className="md:w-3/4 p-6 space-y-4">
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Now Playing: {currentAudio.title}
              </Typography>
              <audio controls className="w-full rounded-md shadow-sm">
                <source src={`${import.meta.env.VITE_BASE_URL_IMAGE}${currentAudio.audio}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Typography color="gray" className="text-base">
                {currentAudio.description}
              </Typography>
            </CardBody>
          </div>
        </Card>
      )}

      {/* List of All Audiobooks in Package */}
      <Typography variant="h4" color="blue-gray" className="font-bold mb-4">
        Included Audiobooks
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audioBooks?.map((book) => (
          <Card key={book.id} className="shadow-md hover:shadow-xl transition-shadow">
            <div className="relative pb-2/3">
              <img
                src={`${import.meta.env.VITE_BASE_URL_IMAGE}${book?.image}`}
                alt={book.title}
                className="h-48 w-full object-cover rounded-t-xl"
              />
            </div>
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="font-semibold mb-2">
                {book?.title}
              </Typography>
              <Typography color="gray" className="text-sm mb-3 line-clamp-2">
                {book.description}
              </Typography>
              <Button 
                color="blue" 
                size="sm" 
                fullWidth
                onClick={() => setCurrentAudio(book)}
              >
                Play Now
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AudioPackageDetail;