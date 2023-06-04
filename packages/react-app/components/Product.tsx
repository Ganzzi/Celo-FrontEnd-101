/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the product
import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractApprove } from "@/hooks/contract/useApprove";
import { useContractCall } from "@/hooks/contract/useContractRead";
import { useContractSend } from "@/hooks/contract/useContractWrite";
import UpdateDeleteModal from "./modal/UpdateDeleteModal";
// Import Icon
import { AiFillSetting } from "react-icons/ai";

// Define the interface for the product, an interface is a type that describes the properties of an object
interface Product {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
}

// Define the Product component which takes in the id of the product and some functions to display notifications
const Product = ({ id, setError, setLoading, clear, searchQuery }: any) => {
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();

  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct }: any = useContractCall("readProduct", [id], true);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  const { writeAsync: purchase, isSuccess: isSuccess } = useContractSend(
    "buyProduct",
    [Number(id)]
  );

  // 0x29a2241af62c0000 0x29a2241af62c0000
  const [product, setProduct] = useState<Product | null>(null);
  // Use the useContractApprove hook to approve the spending of the product's price, for the ERC20 cUSD contract
  const { writeAsync: approve } = useContractApprove(
    product?.price?.toString() || "1"
  );
  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    // Product Component return null if can not get the product
    if (!rawProduct) return null;

    // Set product that was not deleted
    if (rawProduct[0] != "0x0000000000000000000000000000000000000000") {
      setProduct({
        owner: rawProduct[0],
        name: rawProduct[1],
        image: rawProduct[2],
        description: rawProduct[3],
        location: rawProduct[4],
        price: Number(rawProduct[5]),
        sold: rawProduct[6].toString(),
      });
    }
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // update-delete modal visible
  const [modalVisible, setModalVisible] = useState(false);
  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handlePurchase = async () => {
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }
    // Approve the spending of the product's price, for the ERC20 cUSD contract
    const approveTx = await approve();
    // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
    await approveTx.wait(1);
    setLoading("Purchasing...");
    // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
    const res = await purchase();
    // Wait for the transaction to be mined
    await res.wait();
  };

  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const purchaseProduct = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      if (address != product?.owner) {
        await toast.promise(handlePurchase(), {
          pending: "Purchasing product...",
        });
        if (isSuccess) {
          toast.success("Product purchased successfully");
        } else {
          toast.error("Transfer value exceeded balance of sender");
        }
      } else {
        toast.error("You cannot buy your own product!");
        setError("You can not buy your own product!");
      }
      // If there is an error, display the error message
    } catch (e: any) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the purchase is complete, clear the loading state
    } finally {
      setLoading(null);
    }
  };

  // If the product cannot be loaded, return null
  if (!product) return null;

  // hanle search, display if name includes search query
  if (
    searchQuery != "" &&
    !product.name
      .toLocaleLowerCase()
      .includes(searchQuery.toLocaleLowerCase().trim())
  ) {
    return null;
  }

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Return the JSX for the product component
  return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <div className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold */}
          <span
            className={
              "absolute z-10 left-0 mt-4 bg-amber-400 text-black p-1 rounded-r-lg px-4"
            }
          >
            {product.sold} sold
          </span>
          {/* Show button for updating and deleting */}
          {address === product.owner && (
            <>
              <span
                className={
                  "absolute z-10 -top-6 -right-1 mt-4 bg-green-400 text-black text-base py-1.5 rounded-md px-3.5"
                }
              >
                Own by you
              </span>
              <span
                onClick={() => setModalVisible(!modalVisible)}
                className={
                  "absolute cursor-pointer z-10 right-0 top-5 mt-4 bg-gray-800 hover:bg-black text-gray-100 py-1.5 rounded-full px-2.5"
                }
              >
                <AiFillSetting size={24} />
              </span>
            </>
          )}
          {modalVisible && (
            <UpdateDeleteModal
              setLoading={setLoading}
              id={id} // Pass the necessary props to the modal
              currentPrice={product.price}
              onClose={() => setModalVisible(false)}
            />
          )}
          {/* Show the product image */}
          <img
            src={product.image}
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center "
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {identiconTemplate(product.owner)}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.name}</p>
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product.description}
              </h3>
            </div>
          </div>

          <div>
            <div className={"flex flex-row"}>
              {/* Show the product location */}
              <img src={"/location.svg"} alt="Location" className={"w-6"} />
              <h3 className="pt-1 text-sm text-gray-700">{product.location}</h3>
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            <button
              onClick={purchaseProduct}
              className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed"
            >
              {/* Show the product price in cUSD */}
              {address !== product.owner
                ? `Buy for ${productPriceFromWei} cUSD`
                : "You can't buy your product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
