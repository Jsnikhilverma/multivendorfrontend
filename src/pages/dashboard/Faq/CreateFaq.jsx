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
import { TrashIcon } from "@heroicons/react/24/solid";
import CustomTable from "../../../components/CustomTable";
import Toaster, {
  showErrorToast,
  showSuccessToast,
} from "../../../components/Toaster";

function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const token = Cookies.get("token");
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchFaqs = useCallback(
    async (page) => {
      if (!token) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/faqs?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("FAQs:", data.faqs);
        setFaqs(data.faqs || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        showErrorToast("Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchFaqs(currentPage);
  }, [fetchFaqs, currentPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/faqs/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccessToast("FAQ deleted");
      fetchFaqs(currentPage);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      showErrorToast("Failed to delete FAQ");
    }
  };

  const handleCreateFaq = async () => {
    if (!question.trim() || !answer.trim()) {
      showErrorToast("Both question and answer are required.");
      return;
    }

    try {
      setCreating(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/faqs/create`,
        { question, answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessToast("FAQ created");
      setQuestion("");
      setAnswer("");
      fetchFaqs(currentPage);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      showErrorToast("Failed to create FAQ");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    {
      key: "question",
      label: "Question",
      render: (row) => <div>{row.question}</div>,
    },
    {
      key: "answer",
      label: "Answer",
      render: (row) => <div>{row.answer}</div>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Tooltip content="Delete">
          <button onClick={() => handleDelete(row.id)}>
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </Tooltip>
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
              FAQ List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View all FAQs and create new ones
            </Typography>
          </div>
          <Button onClick={handleOpenModal} className="bg-blue-500">
            Add FAQ
          </Button>
        </div>
      </CardHeader>

      <Dialog open={openModal} handler={handleOpenModal}>
        <DialogHeader>Add a New FAQ</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
            <Input
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Textarea
              label="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
              await handleCreateFaq();
              setOpenModal(false);
            }}
            disabled={creating}
            className="bg-blue-500"
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* FAQ Table */}
      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={faqs} />
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

export default Faqs;
