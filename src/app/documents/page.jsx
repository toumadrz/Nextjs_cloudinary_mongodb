"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // ใช้ useRouter
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons";

function DocumentList() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }

  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loadAllData = async () => {
    try {
      const res = await fetch("/api/getAllDoc", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }
      const result = await res.json();
      setData(result.fileData);
    } catch (error) {
      console.log("error = ", error);
    }
  };
  const clear = () => {
    setSearchQuery("");
    setSearchData([]);
    loadAllData();
  };
  const search = async () => {
    try {
      const res = await fetch("/api/searchDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: searchQuery }), // ส่งข้อมูลเป็น JSON
      });
      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }
      const result = await res.json();
      setData(result.fileData);
    } catch (error) {
      console.log("error = ", error);
    }
  };

  const handleDownload = async (url) => {
    try {
      // ดึงชื่อไฟล์จาก URL Cloudinary
      const urlParts = url.split("/");
      const originalFilename = urlParts[urlParts.length - 1];

      // แยกชื่อไฟล์และ public_id
      const publicIdWithExtension = originalFilename.split(".")[0]; 

      // ดึง extension จาก URL
      const extension = url.toLowerCase().split(".").pop(); // เช่น png

      // สร้างชื่อไฟล์ที่จะบันทึก (ใช้ timestamp เพื่อป้องกันชื่อซ้ำ)
      const timestamp = new Date().getTime();
      const fileName = `download_${timestamp}.${extension}`;

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">รายการเอกสาร</h5>
        </div>
        <div className="card-body">
          <form className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาเอกสาร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!searchQuery}
                  onClick={() => search()}
                >
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  ค้นหา
                </button>
                <div>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    type="button"
                    onClick={() => {
                      clear();
                    }}
                  >
                    <FontAwesomeIcon icon={faRefresh} className="me-1" />
                    เคลียร์
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ชื่อเอกสาร</th>
                  <th>รายละเอียด</th>
                  <th>ประเภท</th>
                  <th>ผู้สร้างเอกสาร</th>
                  <th style={{ width: "135px" }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((doc, index) => (
                    <tr key={doc._id}>
                      <td>{doc.name}</td>
                      <td>{doc.detail}</td>
                      <td>{doc.category}</td>
                      <td>{doc.emailUploader}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          {(session.user.role === "admin" ||
                            doc.emailUploader === session.user.email) && (
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() =>
                                console.log("View details:", doc.id)
                              }
                            >
                              แก้ไข
                            </button>
                          )}
                          <button
                            className="btn btn-primary btn-sm ms-2"
                            onClick={() => handleDownload(doc.linkFile)}
                          >
                            โหลด
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No documents available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentList;
