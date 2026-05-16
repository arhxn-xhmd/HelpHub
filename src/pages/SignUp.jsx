import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        setError,
        isSubmitting,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const response = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.reason == "Username") {
                setError("username", { type: "server", message: "Username already exists" });
            }

            if (errorData.reason == "Email") {
                setError("email", { type: "server", message: "Email already exists" });
            }
        }

        const token = await response.json();

        localStorage.setItem('token', token.token);
        window.location.href = "/";
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-black via-purple-900 to-black px-4">

            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 md:p-8">

                <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
                    Help<span className="text-purple-500">Hub</span>
                </h1>

                <p className="text-center text-gray-400 text-sm mb-6">
                    Create your account and start helping 🚀
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {errors.username && <p className="text-red-500 text-sm p-0 m-1">{errors.username.message}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: { value: true, message: "Username is required", minLength: { value: 3, message: "Username must be at least 3 characters" } } })}
                        className="w-full p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    />
                    {errors.email && <p className="text-red-500 text-sm p-0 m-1">{errors.email.message}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: { value: true, message: "Email is required" } })}
                        className="w-full p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    />

                    {errors.specialty && <p className="text-red-500 text-sm p-0 m-1">{errors.specialty.message}</p>}
                    <input
                        type="text"
                        placeholder="Your specialty (e.g. Math, Coding, Physics)"
                        {...register("specialty", { required: { value: true, message: "Specialty is required" } })}
                        className="w-full p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    />

                    {errors.password && <p className="text-red-500 text-sm p-0 m-1">{errors.password.message}</p>}
                    <input
                        type="password"
                        placeholder="Create Password"
                        {...register("password", { required: { value: true, message: "Password is required" } })}
                        className="w-full p-3 rounded-xl bg-black text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    />

                    {isSubmitting ? (
                        <lord-icon
                            src="https://cdn.lordicon.com/ydhnbgpj.json"
                            trigger="loop"
                            colors="primary:#8930e8">
                        </lord-icon>
                    ) : (
                        <button
                            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition active:scale-95"
                        >
                            Sign Up
                        </button>
                    )}
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <p className="px-3 text-gray-500 text-sm">or</p>
                    <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                <p className="text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <span className="text-purple-500 cursor-pointer hover:underline">
                        <Link to="/signin">Sign In</Link>
                    </span>
                </p>

            </div>
        </div>
    );
};

export default SignUp;