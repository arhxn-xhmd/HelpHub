import React, { useState } from 'react'


const Avatar = ({ name, image, size = 'w-28 h-28 md:w-32 md:h-32', margin = 'mb-5', text = 'text-4xl' }) => {

    const avatarColors = [
        "bg-gradient-to-r from-purple-600 to-purple-400",
        "bg-gradient-to-r from-pink-600 to-pink-400",
        "bg-gradient-to-r from-indigo-600 to-indigo-400",
        "bg-gradient-to-r from-blue-600 to-blue-400",
        "bg-gradient-to-r from-cyan-600 to-cyan-400",
        "bg-gradient-to-r from-teal-600 to-teal-400",
        "bg-gradient-to-r from-green-600 to-green-400",
        "bg-gradient-to-r from-lime-600 to-lime-400",
        "bg-gradient-to-r from-yellow-500 to-yellow-300",
        "bg-gradient-to-r from-orange-600 to-orange-400",
        "bg-gradient-to-r from-red-600 to-red-400",
        "bg-gradient-to-r from-rose-600 to-rose-400",
        "bg-gradient-to-r from-fuchsia-600 to-fuchsia-400",
        "bg-gradient-to-r from-violet-600 to-violet-400",
        "bg-gradient-to-r from-sky-600 to-sky-400",
        "bg-gradient-to-r from-emerald-600 to-emerald-400",
        "bg-gradient-to-r from-amber-600 to-amber-400",
        "bg-gradient-to-r from-orange-500 to-orange-300",
        "bg-gradient-to-r from-yellow-500 to-yellow-300",
        "bg-gradient-to-r from-green-500 to-green-300",
        "bg-gradient-to-r from-teal-500 to-teal-300",
        "bg-gradient-to-r from-blue-500 to-blue-300",
        "bg-gradient-to-r from-indigo-500 to-indigo-300",
        "bg-gradient-to-r from-purple-500 to-purple-300",
        "bg-gradient-to-r from-pink-500 to-pink-300",
        "bg-gradient-to-r from-rose-500 to-rose-300"
    ];

    const getColor = (name) => {
        const index = name?.charCodeAt(0) - 65;
        return avatarColors[index % avatarColors.length];
    };


    if (image) {
        return (
            <div className={`${margin}`}>
                <img
                    src={image}
                    alt="profile"
                    className={`${size} rounded-full object-cover border-4 border-purple-500 shadow-lg`}
                />
            </div>


        );
    }

    return (
        <div className={`${margin}`}>
            <div
                className={`${size} rounded-full flex items-center justify-center ${text} font-bold text-white ${getColor(
                    name
                )} border-4 border-purple-500 shadow-lg`}
            >
                {name?.charAt(0).toUpperCase()}
            </div>

        </div>
    );
}

export default Avatar
