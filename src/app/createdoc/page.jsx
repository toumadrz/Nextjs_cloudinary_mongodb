"use client";
import React, { useState } from "react";
import { useRouter } from "next/router"; // ใช้ useRouter
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function UploadPage() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }
  const emailUploader = session?.user?.email;

  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_upload_preset");
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, 
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setUrl(data.url); // ได้ URL ที่ได้จาก Cloudinary
        return data.url;
      } else {
        setError("File upload failed!");
        return null;
      }
    } catch (error) {
      setError("Error uploading file");
      return null;
    } finally {
      setUploading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    //upload
    const fileUrl = await handleUpload();
    if (!fileUrl) {
      setError("File upload failed!");
      return;
    }
    if (!name || !detail || !category || !url) {
      setSuccess("");
      setError("Please provide all input and file!");
      return;
    }

      // บันทึกข้อมูลลง database
    try {
      

    
      const res = await fetch("http://localhost:3000/api/savedata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          detail,
          category,
          linkFile: fileUrl,
          emailUploader,
        }),
      });
      if (res.ok) {
        const form = e.target;
        setError("");
        setSuccess("Upload file successfully!");
        form.reset();
      } else {
        console.log("File upload failed!");
      }
    } catch (error) {
      console.log("Error during registeration: ", error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h3 className="text-center fs-1 text-primary">Create Document</h3>
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
              placeholder="Name"
            />
            <label>Name</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => {
                setDetail(e.target.value);
              }}
              type="text"
              id="detailInput"
              className="form-control rounded-3"
              placeholder="Detail"
            />
            <label>Detail</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              type="text"
              id="categoryInput"
              className="form-control rounded-3"
              placeholder="Category"
            />
            <label>Category</label>
          </div>

          {/* Upload */}
          <div className="form-floating mb-4">
            <input
              onChange={handleFileChange}
              type="file"
              id="formFile"
              className="form-control rounded-3"
              placeholder="Upload File"
            />
            <label>Upload File</label>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary mt-1 rounded-3 w-100"
          >
            Submit
          </button>
        </form>
        <hr className="my-3" />
      </div>
    </div>
  );
}

export default UploadPage;
