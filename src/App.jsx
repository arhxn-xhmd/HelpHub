import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { tokenContext } from "./context/tokenContext";
import { userContext } from "./context/userContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const App = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState({})

  const [isUser, setIsUser] = useState(false)
  const [userData, setUserData] = useState({})

  const userInfo = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token")
      setIsUser(false)
    } else {
      setIsUser(true)
      setUserData(data)
      setUser(data)
      setToken(token)
    }
  }

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      setIsUser(false)
    } else {
      userInfo()
    }
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/signin",
      element: <SignIn />
    },
    {
      path: "/profile",
      element: <Profile />
    }
  ]);

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <tokenContext.Provider value={{ token, setToken }}>
        <userContext.Provider value={{ user, setUser }}>
          <RouterProvider router={router} />
        </userContext.Provider>
      </tokenContext.Provider>
    </>
  )
};

export default App;