import { Metadata } from "next";
import Image from "next/image";
// ✅ Define Product Type
interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

// ✅ Fetch product details from API
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// ✅ Fix: Await `params` before using in `generateMetadata`
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params; // Await params
  const product = await getProduct(resolvedParams.id);

  return {
    title: product ? product.title : "Product Not Found",
    description: product ? product.description : "No details available",
  };
}

// ✅ Fix: Await `params` before using in ProductPage
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Await params
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return <h1 className="text-center text-2xl font-bold mt-10">Product Not Found</h1>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Product Layout */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {/* <img 
            src={product.image} 
            alt={product.title} 
            className="w-full max-h-96 object-contain rounded-lg"
          /> */}

          <Image 
            src={product.image} 
            alt={product.title} 
            width={300} 
            height={300} 
            className="w-full max-h-96 object-contain rounded-lg" 
          />
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-green-600 text-2xl font-bold mt-4">${product.price}</p>

          {/* Add to Cart Button */}
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md mt-6 hover:bg-blue-600 transition">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}
