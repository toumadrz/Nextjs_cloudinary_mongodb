"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";  // ใช้ useRouter
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function RegisterPage() {
  const {data:session} = useSession();
    if (session) {
      redirect("/")
    }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(error);
    if (!name || !email || !password || !confirmPassword) {
      setSuccess("");
      setError("Please provide all input!");
      return;
    }
    if (password != confirmPassword) {
      setSuccess("");
      setError("Password do not match!");
      return;
    }
    try {

      const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
      const { user } = await resCheckUser.json()
      if (user) {
        setSuccess("");
        setError("User already exists!")
        return;
      }

      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        const form = e.target;
        setError("");
        setSuccess("User registration successfully!");
        form.reset();
        router.push("/login");
      } else {
        console.log("Registration Failed.");
      }
    } catch (error) {
      console.log("Error during registeration: ", error);
    }
  };
  return (
    <div>
      <div className="container mt-5">
        <h3 className="text-center fs-1 text-primary">Register Page</h3>
        <hr />
        <form onSubmit={handleSubmit} className="mt-5">
          {error && (
            <div
              className="bg-danger text-white rounded-3 d-flex align-items-center justify-content-center px-3 mb-3 w-100"
              style={{
                height: "3rem",
                fontSize: "1.2rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center px-3 mb-3 w-100"
              style={{
                height: "3rem",
                fontSize: "1.2rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {success}
            </div>
          )}

          <div className="form-floating mb-4 ">
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              id="nameInput"
              className="form-control rounded-3"
              placeholder="Enter your name"
            />
            <label>Enter your name</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="emailInput"
              className="form-control rounded-3"
              placeholder="Enter your email"
            />
            <label>Enter your email</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="passwordInput"
              className="form-control rounded-3"
              placeholder="Enter your password"
            />
            <label>Enter your password</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              type="password"
              id="rePasswordInput"
              className="form-control rounded-3"
              placeholder="Confirm your password"
            />
            <label>Confirm your password</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-1 rounded-3 w-100"
          >
            Submit
          </button>
        </form>
        <hr className="my-3" />
        <p>
          Already have a account? go to{" "}
          <Link className="text-decoration-none" href="/login">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
