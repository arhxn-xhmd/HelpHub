import React, { useState, useContext } from "react";
import Avatar from "./Avatar";
import { tokenContext } from "../context/tokenContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";

const ProblemCard = ({
  user,
  image,
  title,
  description,
  isDelete,
  id
}) => {

  const [answer, setAnswer] = useState("hidden");
  const [showAnswers, setShowAnswers] = useState("hidden");
  const token = useContext(tokenContext)
  const [comments, setComments] = useState([])

  const [form, setForm] = useState({
    answer: "",
    file: null
  });

  const viewAnswers = async () => {
    let response = await fetch(`http://localhost:3000/answers?problemId=${id}`);
    let data = await response.json()
    setComments(data)
    console.log(comments)


    setShowAnswers("block")
    setAnswer("hidden")
  }

  const answerForm = () => {
    setAnswer("flex")
    setShowAnswers('hidden')
  }

  const submitanswer = async () => {
    let formData = new FormData()

    formData.append("problemId", id)
    formData.append("answer", form.answer)
    formData.append("file", form.file)

    const response = await fetch("http://localhost:3000/answers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.token}`
      },
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      toast("Sign In to continue!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setForm({
      answer: "",
      file: null
    });

    toast(result.message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  const deletePost = async (id) => {
    try {
      let response = await fetch("http://localhost:3000/problems/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      let result = await response.json();

      toast(result.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.log(error);

      toast("Something went wrong", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const dislike = async (answerId) => {
    let response = await fetch(`http://localhost:3000/answers/dislikes?answerId=${answerId}`, {
      headers: {
        "Authorization":`Bearer ${token.token}`
      }
    });
    let data = await response.json()
    
    toast(data.message, {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    });

    viewAnswers();

  }

  const like = async (answerId) => {
    let response = await fetch(`http://localhost:3000/answers/likes?answerId=${answerId}`, {
      headers: {
        "Authorization":`Bearer ${token.token}`
      }
    });
    let data = await response.json()
    
    toast(data.message, {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    });

    viewAnswers();

  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-5 mb-6 hover:scale-[1.02] transition duration-300">



      {/* User */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          name={user.username}
          image={user.profilePic}
          size="w-12 h-12"
          margin="m-0"
          text="text-2xl"
        />

        <h2 className="text-white font-semibold text-sm md:text-lg">
          {user.username}
        </h2>
      </div>

      {/* Title */}
      <h3 className="text-lg md:text-2xl text-white font-bold mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm md:text-base mb-3">
        {description}
      </p>

      {/* Image */}
      {image && (
        <img
          src={image}
          alt="problem"
          className="w-full max-h-60 object-cover rounded-xl mb-3 border border-gray-700"
        />
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex flex-wrap gap-4 text-gray-400 text-sm md:text-base">

          <button className="hover:text-purple-400 transition" onClick={viewAnswers}>
            View Answers
          </button>

          <button className="hover:text-fuchsia-400 transition" onClick={answerForm}>
            Answer
          </button>

        </div>

        {isDelete && (
          <div
            onClick={() => deletePost(id)}
            className="cursor-pointer"
          >
            <lord-icon
              src="https://cdn.lordicon.com/xyfswyxf.json"
              trigger="hover"
              colors="primary:#e83a30"
            >
            </lord-icon>
          </div>
        )}
      </div>

      {/* Answer Box */}
      <div className={`w-full ${answer} items-center gap-2 sm:gap-3 bg-[#1a1024]/80 border border-fuchsia-400/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-md shadow-[0_0_25px_rgba(232,121,249,0.12)] transition-all duration-300 focus-within:border-fuchsia-400/50 focus-within:shadow-[0_0_30px_rgba(232,121,249,0.25)]`}>

        {/* Upload */}
        <label
          htmlFor={`answerFile-${id}`}
          className="flex items-center justify-center px-3 sm:px-4 h-11 sm:h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-fuchsia-400/10 hover:text-fuchsia-300 hover:border-fuchsia-400/40 cursor-pointer transition-all duration-300"
        >
          <lord-icon
            src="https://cdn.lordicon.com/ukdwhewu.json"
            trigger="hover"
            colors="primary:#ffffff"
          >
          </lord-icon>

          <input
            type="file"
            id={`answerFile-${id}`}
            className="hidden"
            onChange={(e) =>
              setForm({ ...form, file: e.target.files[0] })
            }
          />
        </label>

        {/* Input */}
        <input
          type="text"
          placeholder="Write your answer..."
          className="flex-1 bg-transparent outline-none border-none text-white placeholder:text-gray-500 text-sm sm:text-base"
          value={form.answer}
          onChange={(e) =>
            setForm({ ...form, answer: e.target.value })
          }
        />

        {/* Send */}
        <button
          className="flex items-center justify-center px-4 sm:px-5 h-11 sm:h-12 rounded-xl bg-linear-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white hover:scale-105 hover:from-violet-500 hover:via-purple-400 hover:to-fuchsia-400 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-sm sm:text-base font-semibold"
          onClick={submitanswer}
        >
          <lord-icon
            src="https://cdn.lordicon.com/jqisugjj.json"
            trigger="hover"
            colors="primary:#ffffff"
          >
          </lord-icon>
        </button>

      </div>

      {comments && comments.length === 0 && (
        <div className={`w-full ${showAnswers} flex flex-col items-center justify-center text-center bg-[#1a1024]/80 border border-fuchsia-400/20 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_25px_rgba(232,121,249,0.12)]`}>

          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fuchsia-400/10 border border-fuchsia-400/20 mb-4">
            <lord-icon
              src="https://cdn.lordicon.com/wjyqkiew.json"
              trigger="loop"
              delay="2000"
              colors="primary:#e879f9"
              style={{ width: "40px", height: "40px" }}
            >
            </lord-icon>
          </div>

          <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
            No answers yet
          </h3>

          <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
            Looks like nobody has solved this problem yet.
            Be the first one to share your knowledge and help others out 🚀
          </p>

        </div>
      )}

      {comments && comments.map((comment => {
        return <div key={comment._id} className={`w-full ${showAnswers} bg-[#1a1024]/80 border border-fuchsia-400/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-[0_0_25px_rgba(232,121,249,0.12)] transition-all duration-300 hover:border-fuchsia-400/40 hover:shadow-[0_0_30px_rgba(232,121,249,0.18)]`}>

          {/* Top Section */}
          <div className="flex items-start justify-between gap-3">

            {/* Left */}
            <div className="flex items-center gap-3">

              {/* Profile Pic */}
              <Avatar name={comment.user.username} image={comment.user.profilePic} size="md:w-15 md:h-15 w-10 h-10" margin="mb-0" text="text-2xl" />

              {/* Name + Time */}
              <div>
                <h3 className="text-white text-sm sm:text-base font-semibold">
                  {comment.user.username}
                </h3>

                <p className="text-gray-400 text-xs sm:text-sm">
                  {new Date(comment.time).toLocaleString()}
                </p>
              </div>

            </div>

          </div>

          {/* Answer Text */}
          <div className="mt-4">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {comment.answer}
            </p>
          </div>

          {/* Uploaded Image */}

          {comment.answerPic && <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={comment.answerPic}
              alt="answer"
              className="w-full max-h-100 object-cover hover:scale-[1.02] transition-all duration-500"
            />
          </div>}

          {/* Bottom Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">

            {/* Like */}
            <button className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-fuchsia-400/10 hover:text-fuchsia-300 hover:border-fuchsia-400/40 transition-all duration-300"
            onClick={() => like(comment._id)}>
              <BiSolidLike className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base font-medium">{comment.likes}</span>
            </button>

            {/* Dislike */}
            <button
              className=" w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400/40transition-all duration-300"
              onClick={() => dislike(comment._id)}
            >
              <BiSolidDislike className="text-base sm:text-lg" />

              <span className="text-sm sm:text-base font-medium">
                {comment.dislikes}
              </span>
            </button>


          </div>

        </div>
      }))}
    </div>
  );
};

export default ProblemCard;