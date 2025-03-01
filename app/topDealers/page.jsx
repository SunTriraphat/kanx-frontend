"use client";
import React from "react";
import Navbar from "../../components/navBar/Navbar";
import MenuDash from "../../components/menuDash/MenuDash";
import DealerCard from "../../components/DealerCard";
import { set } from "rsuite/esm/internals/utils/date";

function TopDealers() {
    const [dealersByRegion, setDealersByRegion] = React.useState({});
    const [top10, setTop10] = React.useState([]);

    React.useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const storedDealers = localStorage.getItem("top");
        const storedTop10 = localStorage.getItem("top10");
        if (storedDealers) {
            setDealersByRegion(JSON.parse(storedDealers));
            setTop10(JSON.parse(storedTop10));
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50 h-screen">
                <MenuDash />
                <div className="flex gap-5">
                    <h1 className="text-3xl text-gray-800 mb-2 font-bold text-start">
                        Top Dealers by Region
                    </h1>
                </div>
                <DealerCard title="Top 10 Dealers" dealers={top10} gradient="bg-gradient-to-r from-amber-500 to-amber-400" />
                <div className="w-full grid gap-6">
                    {Object.entries(dealersByRegion).map(([region, dealers]) => (
                        <DealerCard
                            key={region}
                            title={region}
                            dealers={dealers}
                            gradient={`bg-gradient-to-r from-violet-500 to-violet-400`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}


export default TopDealers;
