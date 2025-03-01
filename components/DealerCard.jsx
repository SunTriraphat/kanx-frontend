import React, { useState } from "react";

const DealerCard = ({ title, dealers, gradient }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // กำหนดจำนวนรายการที่จะแสดง (5 รายการเมื่อยังไม่ expand)
    const visibleDealers = isExpanded ? dealers : dealers.slice(0, 5);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-5">
            <h3
                className={`text-xl font-semibold text-white rounded-lg shadow-md p-6 ${gradient} hover:shadow-xl transition-shadow duration-300`}
            >
                {title}
            </h3>
            <div className="overflow-x-auto mt-10">
                <div className="grid grid-cols-[200px_repeat(8,_1fr)] font-semibold text-sm text-gray-600 text-center border-b border-gray-300 pb-2 mb-4">
                    <div>Dealer</div>
                    <div>Sunday</div>
                    <div>Lmg</div>
                    <div>Muang Thai</div>
                    <div>Navakij</div>
                    <div>Dhipaya</div>
                    <div>Tokio Marine</div>
                    <div>Viryah</div>
                    <div>Total</div>
                </div>
                {visibleDealers.map((item, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-[200px_repeat(8,_1fr)] text-center text-gray-700 py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                    >
                        <div className="w-full font-semibold text-center">{item.dealer}</div>
                        <div>{item.Sunday || 0}</div>
                        <div>{item.LMG || 0}</div>
                        <div>{item.MuangThai || 0}</div>
                        <div>{item.Navakij || 0}</div>
                        <div>{item.Dhipaya || 0}</div>
                        <div>{item.TokioMarine || 0}</div>
                        <div>{item.Viriyah || 0}</div>
                        <div className="text-amber-500 font-semibold">
                            {item.total}
                        </div>
                    </div>
                ))}
            </div>

            {dealers.length > 5 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={toggleExpand}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        {isExpanded ? "Show Less" : "Show More"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DealerCard;
