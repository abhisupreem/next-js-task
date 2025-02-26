import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;

  // Fetch products from the selected category
  const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);

  if (!res.ok) return notFound(); // Show 404 if category is invalid

  const products = await res.json();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">{category.replace("-", " ")}</h1>

      {/* Back to Categories */}
      <div className="mb-4">
        <Link href="/categories" className="text-blue-600 hover:underline">← Back to Categories</Link>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link key={product.id} href={`/product/${product.id}`} passHref>
              <div className="border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition">
                <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />
                <h2 className="text-lg font-semibold mt-2 line-clamp-2 flex-grow min-h-[3.5rem]">
  {product.title}
</h2>
                <p className="text-green-600 font-bold">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}
