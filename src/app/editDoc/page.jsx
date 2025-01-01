"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function EditPage() {
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
    //ดึงIdมา
  useEffect(()  => {
    const loadData = async () => {
        const docId = searchParams.get("id");
        console.log(docId)
        if (docId) {
          setId(docId);
          await getData(docId);
        }
        
      };
      loadData();
  }, [searchParams]);
  //ดึงข้อมูลDocumentมาจากmongodb แล้วใส่ข้อมูลนั้นลงในstate
  const getData = async (docId) => {
    try {
      const res = await fetch("/api/getDocById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: docId }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }
      const result = await res.json();
      setName(result.fileData.name|| "name");
      setDetail(result.fileData.detail);
      setCategory(result.fileData.category);
      setUrl(result.fileData.linkFile);
    } catch (error) {
      console.log("error = ", error);
      setError("Failed to fetch document data");
    }
    console.log(name)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return url; // ถ้าไม่ได้อัพโหลดไฟล์ใหม่ก็ใช้ url เก่า

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
        const newUrl = data.url;
        setUrl(newUrl);
        return newUrl;
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

    const fileUrl = await handleUpload();
    if (!fileUrl) {
      setError("File upload failed!");
      return;
    }

    try {
      const res = await fetch("/api/updateDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docId: id,
          name,
          detail,
          category,
          linkFile: fileUrl,
        }),
      });
      
      if (res.ok) {
        setError("");
        setSuccess("Document updated successfully!");
      } else {
        setError("Failed to update document");
      }
    } catch (error) {
      console.log("Error during update: ", error);
      setError("Failed to update document");
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h3 className="text-center fs-1 text-primary">Edit Document</h3>
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
          <div className="form-floating mb-4">
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="nameInput"
              className="form-control rounded-3"
              placeholder="Name"
              value={name}
            />
            <label>Name</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => setDetail(e.target.value)}
              type="text"
              id="detailInput"
              className="form-control rounded-3"
              placeholder="Detail"
              value={detail}
            />
            <label>Detail</label>
          </div>
          <div className="form-floating mb-4">
            <input
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              id="categoryInput"
              className="form-control rounded-3"
              placeholder="Category"
              value={category}
            />
            <label>Category</label>
          </div>

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

          <button
            type="submit"
            className="btn btn-primary mt-1 rounded-3 w-100"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </form>
        <hr className="my-3" />
      </div>
    </div>
  );
}

export default EditPage;