"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // ใช้ useEffect เพื่อทำการ redirect
  useEffect(() => {
    if (session) {
      // ถ้ามี session ให้ย้ายไปยังหน้า welcome
      router.push("/welcome");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password ) {
      setError("Please provide email and password!");
      return;
    }
    try {
      const res = await signIn("credentials",{
        email,password,redirect:false
      })
      

      if (res.error) {
        setError("Invalid credentials");
        return;
      }

      router.replace("welcome");

    } catch (error) {
      
    }
  }
  
  return (
    <div>
      <div className="container mt-5">
        <h3 className="text-center fs-1 text-primary">Login Page</h3>
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
          <div className="form-floating mb-4">
            <input
              type="email"
              id="emailInput"
              className="form-control rounded-3"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label>Enter your email</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              id="passwordInput"
              className="form-control rounded-3"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label>Enter your password</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-1 rounded-3 w-100"
          >
            Login
          </button>
        </form>
        <hr className="my-3" />
        <p>
          Do not have a account? go to{" "}
          <Link className="text-decoration-none" href="/register">
            Register
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
