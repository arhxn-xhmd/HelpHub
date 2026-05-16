import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProblemCard from "../components/ProblemCard";
import Footer from "../components/Footer";
import Avatar from "../components/Avatar";
import { tokenContext } from "../context/tokenContext";
import { userContext } from "../context/userContext";

const Profile = () => {
  const token = useContext(tokenContext)
  const user = useContext(userContext)

  const [posts, setPosts] = useState([])

  const handleChange = async (e) => {
    const file = e.target.files[0]

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/user/profilePic", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token.token}`
      }
    })

    const data = await res.json();
  }

  const userProblems = async () => {
    let response = await fetch('http://localhost:3000/problems/profile', {
      headers: {
        "Authorization": `Bearer ${token.token}`
      }
    })
    let problems = await response.json()
    setPosts(problems);
  }

  useEffect(() => {
    if (!token?.token) return; 

    userProblems();
  }, [token?.token]);

  console.log(user.user)

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-purple-900 to-black text-white">
      <Navbar isUser={!!token.token} />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* PROFILE SECTION */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-800 pb-6">

          {/* Avatar */}
          <div>
            <Avatar name={user.user.username} image={user.user.profilePic} />
            <label
              htmlFor="fileInput"
              className={`px-5 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200`}
            >
              Choose Image
            </label>

            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleChange}
            />
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {user.user.username}
            </h1>

            <p className="text-gray-400 mt-2 max-w-md">
              {user.user.specialty}
            </p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold text-white">{user.user.posts}</span>{" "}
                <span className="text-gray-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-white">{user.user.answers}</span>{" "}
                <span className="text-gray-400">Answers</span>
              </div>
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="max-w-2xl md:max-w-3xl mx-auto mt-8 md:mt-8 px-3 md:px-4">
          <h2 className="text-4xl mb-4 text-purple-400 font-bold text-center">
            Your Posts
          </h2>

          {Array.isArray(posts) && posts.length === 0 ? (
            <p className="text-center text-gray-400 mt-6">
              No posts yet
            </p>
          ) : (
            Array.isArray(posts) && posts.map((problem) => (
              <ProblemCard
                key={problem._id}
                user={user.user}
                image={problem.problemPic}
                title={problem.title}
                description={problem.description}
                isDelete={true}
                id={problem._id}
              />
            ))
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Profile;