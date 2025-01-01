"use client";

import Link from "next/link";
import React from "react";
import styles from "../style/navbarcomponent.module.css";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
 
  return (
    <nav className="navbar navbar-expand-lg  navbar-light bg-primary shadow-lg mb-4">
      <div className="container-fluid me-3 ms-4">
        <Link
          href="/"
          className={`navbar-brand fs-3 text-white ${styles.navbarBrand}`}
        >
          ระบบจัดการเอกสาร
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse fs-4" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!session ? (
              <>
                <li className="nav-item">
                  <Link
                    href="/login"
                    className={`nav-link text-white ${styles.navLink}`}
                  >
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/register"
                    className={`nav-link text-white ${styles.navLink}`}
                  >
                    สมัครสมาชิก
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    href="/documents"
                    className={`nav-link text-white ${styles.navLink}`}
                  >
                    รายการเอกสาร
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/createdoc"
                    className={`nav-link text-white ${styles.navLink}`}
                  >
                    อัพโหลดเอกสาร
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    onClick={() => signOut()}
                    className={`nav-link text-white ${styles.navLink}`}
                    style={{ cursor: "pointer" }}
                  >
                    ออกจากระบบ
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
