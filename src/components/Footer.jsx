import React from "react";

const Footer = () => {
  return (
    <div className="text-center text-gray-500 text-sm md:text-base py-6 border-t border-gray-800 mt-10">
      <h1 className="text-lg md:text-xl font-bold text-white">
        Help<span className="text-purple-500">Hub</span>
      </h1>
      <span>&copy; {new Date().getFullYear()} Made with ❤️ and ☕ by arhxn-xhmd</span>
    </div>
  );
};

export default Footer;