"use client";
// import Navbar from "../../components/Navbar";
import Navbar from "../../components/navBar/Navbar";
import { useState } from "react";
import CustomTableClassic from "../../components/CustomTableClassic";
import * as XLSX from "xlsx";

export default function Page() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateType, setDateType] = useState("coverage_date");
    const [dataType, setDataType] = useState("data1");
    const [isLoading, setIsLoading] = useState(false);

    const [columns, setColumns] = useState([]);
    // const [columns, setColumns] = useState([
    //     { key: "DateTimeUtc", label: "DateTimeUtc" },
    //     { key: "EffectiveDateStart", label: "EffectiveDateStart" },
    //     { key: "Model", label: "Model" },
    //     { key: "SubModel", label: "SubModel" },
    //     { key: "PolicyStatus", label: "PolicyStatus" },
    //     { key: "InsuranceProvider", label: "InsuranceProvider" },
    //     { key: "Vin", label: "Vin" },
    //     { key: "Color", label: "Color" },
    //     { key: "CustomerFirstName", label: "CustomerFirstName" },
    //     { key: "CustomerLastName", label: "CustomerLastName" },
    //     { key: "DealershipName", label: "DealershipName" },
    // ]);
    // ฟังก์ชันดึงข้อมูลรายงาน
    const handleFetchReport = async (type) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}report/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                    data_type: dataType,
                    query_type: dateType,
                }),
            });

            if (!response.ok) {
                throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
            }

            const result = await response.json();
            console.log('result',result);
            
            if (result.columns) {
                // แปลงค่า columns ที่ได้จาก API ให้อยู่ในรูปแบบที่ต้องการ
                const formattedColumns = result.columns.map((col,index) => ({
                    key: col,
                    label: col,
                }));
                console.log('formattedColumns',formattedColumns);
                
                setColumns(formattedColumns); // อัปเดต state columns
            }
            setData(result.data);

            if (type === "xlsx") {
                generateExcel(result.data);
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันสร้างไฟล์ Excel โดยใช้ xlsx
    const generateExcel = (reportData) => {
        // แปลงข้อมูลเป็นรูปแบบที่ xlsx เข้าใจ
        const worksheetData = reportData.map((item) =>
            columns.reduce((obj, col) => {
                obj[col.label] = item[col.key];
                return obj;
            }, {})
        );

        // สร้างไฟล์ Excel
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        // ดาวน์โหลดไฟล์ Excel
        XLSX.writeFile(workbook, "report.xlsx");
    };

    return (
        <>
            <Navbar />
            <div className="p-10 bg-gray-50 min-h-screen">
                <div className="max-w-full bg-white p-6 rounded-lg shadow-md">
                    {/* Form Section */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-wrap items-end gap-4"
                    >
                        {/* Dropdown */}
                        <div className="flex flex-col">
                            <label htmlFor="dataType" className="text-sm font-medium text-gray-700">
                                เลือกประเภทข้อมูล
                            </label>
                            <select
                                id="dataType"
                                value={dataType}
                                onChange={(e) => setDataType(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="data1">แจ้งประกันภัย</option>
                                <option value="detail">จดทะเบียน</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="dateType" className="text-sm font-medium text-gray-700">
                                เลือกประเภทวันที่
                            </label>
                            <select
                                id="dateType"
                                value={dateType}
                                onChange={(e) => setDateType(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="coverage_date">วันที่คุ้มครอง</option>
                                <option value="import_date">วันที่นำเข้า</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                วันที่เริ่มต้น
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                                วันที่สิ้นสุด
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        {/* Preview Button */}
                        <div>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleFetchReport("preview")}
                                className={`inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                ดูตัวอย่าง
                            </button>
                        </div>

                        {/* Download XLSX Button */}
                        <div>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleFetchReport("xlsx")}
                                className={`inline-flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                ดาวน์โหลด XLSX
                            </button>
                        </div>
                    </form>
                </div>

                {/* Report Section */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">ผลการค้นหารายงาน</h2>
                    {data.length > 0 ? (
                        <CustomTableClassic data={data} columns={columns} />
                    ) : (
                        <p className="text-gray-600 mt-4">ยังไม่มีข้อมูลรายงานในขณะนี้...</p>
                    )}
                </div>
            </div>
        </>
    );
}
