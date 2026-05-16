import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";
import Avatar from "./Avatar";

const Navbar = (props) => {
  const user = useContext(userContext)
  return (
    <div className="w-full flex justify-between items-center px-4 md:px-8 py-4 bg-black/60 backdrop-blur-md border-b border-gray-800 max-w-7xl mx-auto">

      <Link to={'/'}><h1 className="text-xl md:text-3xl font-bold text-white">
        Help<span className="text-purple-500">Hub</span>
      </h1></Link>

      <div className="relative w-[70%] hidden md:flex items-center justify-center">
        <lord-icon
          src="https://cdn.lordicon.com/vayiyuqd.json"
          trigger="hover"
          colors="primary:#8930e8"
          className="w-5 h-5 absolute left-14 top-1/2 -translate-y-1/2 cursor-pointer">
        </lord-icon>

        <input
          type="text"
          placeholder="Search problems, topics..."
          className="w-[90%] pl-10 pr-4 py-2 rounded-full bg-transparent text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {!props.isUser && (
        <div className="flex gap-5 items-center justify-center">
          <button className="px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition active:scale-95 shadow-lg shadow-purple-500/20">
            <Link to="/signup">Sign Up</Link>
          </button>
          <button className="px-6 py-2 rounded-xl border border-purple-500 text-purple-500 font-semibold hover:bg-purple-500 hover:text-white transition active:scale-95">
            <Link to="/signin">Sign In</Link>
          </button>
        </div>
      )}

      {props.isUser && (
        <div className="flex gap-5 items-center justify-center">

          <Link to='/profile'><Avatar name={user.user.username} image={user.user.profilePic} size="md:w-15 md:h-15 w-10 h-10" margin="mb-0" text="text-2xl"/></Link>
        </div>)}
    </div>
  );
};

export default Navbar;