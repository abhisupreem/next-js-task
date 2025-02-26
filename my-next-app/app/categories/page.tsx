import Link from "next/link";

export default async function CategoriesPage() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories: string[] = await res.json();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Product Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category} href={`/categories/${category}`} passHref>
            <div className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 text-center capitalize cursor-pointer bg-white">
              {category.replace("-", " ")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
