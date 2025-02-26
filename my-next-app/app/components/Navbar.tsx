"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingCart, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("https://fakestoreapi.com/products/categories");
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <nav className="bg-blue-900 shadow-md text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          MyShop
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-gray-300">Home</Link>

          {/* Categories Dropdown (on Click) */}
          <div className="relative">
            <button 
              className="flex items-center hover:text-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle on click
            >
              Categories <FiChevronDown className="ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${category}`}
                    className="block px-4 py-2 hover:bg-gray-200 capitalize"
                    onClick={() => setDropdownOpen(false)} // Close menu on selection
                  >
                    {category.replace("-", " ")}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/cart" className="hover:text-gray-300 flex items-center">
            Cart <FiShoppingCart className="ml-1" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 border-t">
          <Link href="/" className="block px-4 py-2 text-white hover:bg-blue-700">Home</Link>

          {/* Mobile Dropdown Categories */}
          <button 
            className="block px-4 py-2 text-white hover:bg-blue-700 w-full text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle categories on click
          >
            Categories
          </button>
          
          {dropdownOpen && (
            <div className="bg-blue-700">
              {categories.map((category) => (
                <Link 
                  key={category} 
                  href={`/categories/${category}`} 
                  className="block px-6 py-1 text-white hover:bg-blue-600 capitalize"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false); // Close menu on selection
                  }}
                >
                  {category.replace("-", " ")}
                </Link>
              ))}
            </div>
          )}

          <Link href="/cart" className="block px-4 py-2 text-white hover:bg-blue-700 flex items-center">
            Cart <FiShoppingCart className="ml-1" />
          </Link>
        </div>
      )}
    </nav>
  );
}
