import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import PostBox from "../components/PostBox";
import ProblemCard from "../components/ProblemCard"
import Footer from "../components/Footer";
import { tokenContext } from "../context/tokenContext";
import { userContext } from "../context/userContext";

const Home = () => {

  const globalToken = useContext(tokenContext)
  const user = useContext(userContext)
  const [feed, setFeed] = useState([])

  const fetchFeed = async () => {
    let response = await fetch('http://localhost:3000/problems')
    let data = await response.json()
    setFeed(data)
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (

    <div className="min-h-screen bg-linear-to-b from-black via-purple-900 to-black">

      <Navbar isUser={!!globalToken.token} />

      <div className="max-w-2xl md:max-w-3xl mx-auto mt-6 md:mt-8 px-3 md:px-4">
        <PostBox />
        <div>
          <div>
            {feed.map((problem) => (
              <ProblemCard
                key={problem._id}
                user={problem.user}
                image={problem.problemPic}
                title={problem.title}
                description={problem.description}
                isDelete={false}
                id={problem._id}
              />
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;