// Importing the dependencies
import { useState } from "react";
// Import ethers to convert the product price to wei
import { ethers } from "ethers";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import the useDebounce hook to debounce the input fields
import { useDebounce } from "use-debounce";
// Import our custom useContractSend hook to write a product to the marketplace contract
import { useContractSend } from "@/hooks/contract/useContractWrite";
// Import Close Icon
import { AiOutlineClose } from "react-icons/ai";

// Define prop type for the modal
interface UpdateDeleteModalProps {
  id: number;
  currentPrice: number;
  setLoading: (message: string) => void;
  onClose: () => void;
}

// define the modal component
const UpdateDeleteModal: React.FC<UpdateDeleteModalProps> = ({
  id,
  currentPrice,
  onClose,
  setLoading,
}) => {
  // state defination
  const [newPrice, setNewPrice] = useState<string | number>(0);
  const [debouncedProductPrice] = useDebounce(newPrice, 500);

  // parse price to wei
  const productPriceInWei = ethers.utils.parseEther(
    debouncedProductPrice.toString() || "0"
  );

  // Use the useContractSend hook to update the product with the id and the price in wei passed in, via the marketplace contract
  const { writeAsync: update } = useContractSend("updateProduct", [
    Number(id),
    productPriceInWei,
  ]);

  // Use the useContractSend hook to delete the product with the id passed in, via the marketplace contract
  const { writeAsync: destroy } = useContractSend("removeProduct", [
    Number(id),
  ]);

  // Define function that handles the update action of a product through the marketplace contract
  const handleUpdate = async () => {
    if (!update) {
      throw "Failed to create product";
    }

    setLoading("Updating...");
    onClose();

    // Create the product by calling the writeProduct function on the marketplace contract
    const updateTx = await update();
    setLoading("Waiting for confirmation...");
    // Wait for the transaction to be mined
    await updateTx.wait();
  };

  // Define the updateProduct function that is called when the user clicks the update button
  const updateProduct = async () => {
    try {
      // Display a notification while the product is being added to the marketplace
      await toast.promise(handleUpdate(), {
        pending: "Updating product...",
        success: "Product uppdated successfully",
        error: "Something went wrong. Try again.",
      });
      // Display an error message if something goes wrong
    } catch (e: any) {
      console.log({ e });
      toast.error(e?.message || "Something went wrong. Try again.");
      // Clear the loading state after the product is added to the marketplace
    } finally {
      setLoading("");
      location.reload();
    }
  };

  // Define function that handles the delete action of a product through the marketplace contract
  const handleDelete = async () => {
    if (!destroy) {
      throw "Failed to create product";
    }

    setLoading("deleting...");

    onClose();

    // Create the product by calling the writeProduct function on the marketplace contract
    const deleteTx = await destroy();
    setLoading("Waiting for confirmation...");
    // Wait for the transaction to be mined
    await deleteTx.wait();
  };

  // Define the deleteProduct function that is called when the user clicks the delete button
  const deleteProduct = async () => {
    try {
      // Display a notification while the product is being added to the marketplace
      await toast.promise(handleDelete(), {
        pending: "Deleting product...",
        success: "Product deleted successfully",
        error: "Something went wrong. Try again.",
      });
      // Display an error message if something goes wrong
    } catch (e: any) {
      console.log({ e });
      toast.error(e?.message || "Something went wrong. Try again.");
      // Clear the loading state after the product is added to the marketplace
    } finally {
      setLoading("");
      location.reload();
    }
  };

  // Return the Update & Delete modal JSX component
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        {/* Title and close button */}
        <div className="flex flex-row">
          <h1 className="text-xl font-semibold mb-4 flex-1">
            Update and Delete
          </h1>

          {/* Close Button */}
          <button className="bg-red-600 px-2 rounded-xl" onClick={onClose}>
            <AiOutlineClose size={30} />
          </button>
        </div>

        {/* Display current price */}
        <div className="mb-4">
          <label className="block my-4 font-semibold">
            Current Price: {currentPrice / 1000000000000000000}
          </label>
        </div>

        {/* Input to get new price */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">New Price:</label>
          <input
            type="number"
            step="0.001"
            min="0.005"
            max="100"
            // value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>

        {/* 2 Buttons to update and delete */}
        <div className="flex justify-between">
          <button
            onClick={updateProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Update
          </button>
          <button
            onClick={deleteProduct}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeleteModal;
