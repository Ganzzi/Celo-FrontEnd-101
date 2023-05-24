// This is the main page of the app

// Import the AddProductModal and ProductList components
import AddProductModal from "@/components/modal/AddProductModal";
import ProductList from "@/components/ProductList";

// Export the Home component
export default function Home() {
  return (
    <div className="w-full">
      <AddProductModal />
      <ProductList />
    </div>
  );
}
