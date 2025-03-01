"use client";
import React from "react";
import { RxDashboard } from "react-icons/rx";
import { CiTrophy } from "react-icons/ci";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Dash.module.css";

function Menu() {
    const pathname = usePathname();

    return (
        <div className="grid grid-cols-2 w-80 mb-7 space-x-4">

            <Link
                href="dashBoard"
                className={`${styles.menuLink} flex flex-row items-center gap-1 relative px-4 py-2 rounded-md transition-all duration-300 
                ${pathname === "/dashBoard" ? `${styles.active} ` : `${styles.hover} text-white`}
            `}
            >
                <RxDashboard />
                <span>Dashboard</span>

                {pathname !== "/dashBoard" && (
                    <div
                        className={`absolute bottom-0 left-0 w-full    transition-all duration-300`}
                    ></div>
                )}
            </Link>


            <Link
                href="topDealers"
                className={`${styles.menuLink} flex flex-row items-center gap-1 relative px-4 py-2 rounded-md transition-all duration-300
                    ${pathname === "/topDealers" ? `${styles.active} text-white` : `${styles.hover} text-white`}
                `}
            >
                <CiTrophy />
                <span>Top Dealers</span>

                {pathname !== "/topDealers" && (
                    <div
                        className={`absolute bottom-0 left-0 w-full    transition-all duration-300`}
                    ></div>
                )}
            </Link>
        </div>
    );
}

export default Menu;
