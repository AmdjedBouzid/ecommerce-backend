"use client";
import axios from "axios";
import React, { useState } from "react";

export default function Page() {
  const [pink, setpink] = useState("");
  const hundellogin = async () => {
    const admin = {
      username: "first Admin",
      email: "amdjedbouzid9@gmail.com",
      password: "firstclient1",
      phonenumber: "0793798095",
    };

    try {
      const response = await axios.post(
        "https://ecommerce-backend-three-beta.vercel.app/api/auth/login-admin",
        admin
      );
      console.log("Login successful:", response.data);
      setpink(response.data.Pin);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error response:", error.response);
        if (error.response.status === 401) {
          console.error("Unauthorized: Invalid credentials.");
        } else {
          console.error("Error:", error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Understand User Flow.
            <span className="sm:block"> Increase Conversion. </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            {pink !== "" ? `your code pin:${pink}` : "hello world"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              onClick={hundellogin} // This will trigger the login function on click
            >
              Get Started
            </button>

            <a
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
