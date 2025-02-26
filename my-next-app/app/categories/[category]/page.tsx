import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

// Fetch Products
async function getProducts(category: string): Promise<Product[] | null> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const products = await getProducts(category);
  if (!products) return notFound();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">{category.replace("-", " ")}</h1>

      <div className="mb-4">
        <Link href="/categories" className="text-blue-600 hover:underline">← Back to Categories</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <div className="border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition">
              <Image 
                src={product.image} 
                alt={product.title} 
                width={200} 
                height={200} 
                className="w-full h-48 object-contain" 
              />
              <h2 className="text-lg font-semibold mt-2 line-clamp-2 flex-grow min-h-[3.5rem]">
                {product.title}
              </h2>
              <p className="text-green-600 font-bold">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Fix `generateMetadata`
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.category.replace("-", " ")} - Products`,
    description: `Browse products in the ${resolvedParams.category.replace("-", " ")} category.`,
  };
}
