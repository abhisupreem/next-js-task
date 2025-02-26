"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search bar state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 10; // Show 10 products per page

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      });
  }, []);

  // Sorting logic
  useEffect(() => {
    let sorted = [...filteredProducts];

    if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  }, [sortOption]);

  // Enhanced Search Filter (Matches any part of title)
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset pagination when searching
  }, [searchQuery, products]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>

      {/* Error Handling */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Search Bar & Sorting */}
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/3"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="default">Sort By</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-xl font-semibold">Loading products...</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="h-full">
                  <div className="border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition flex flex-col h-full">
                    {/* Image */}
                    <div className="w-full h-48 flex justify-center items-center">
                      <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                    </div>

                    {/* Title & Price */}
                    <h2 className="text-lg font-semibold mt-2 line-clamp-2 flex-grow min-h-[3.5rem]">
  {product.title}
</h2>
                    <p className="text-green-600 font-bold">${product.price}</p>

                    {/* Button (sticks at bottom) */}
                    <div className="mt-auto">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-2 hover:bg-blue-600">
                        View Product
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-xl font-semibold col-span-full">No products found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                Previous
              </button>

              <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
