"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navBar/Navbar";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
const data = [
  {
    date: "2024-11-01",
    dealer: "Dealer A",
    model: "Model X",
    vinNo: "12345ABCDE",
    customerName: "นาย สมชาย",
    insuranceCompany: "บริษัท ABC",
    coverage: "ประกันภัยทั่วไป",
    expiration: "2025-11-01",
    paymentDate: "2024-11-01",
    paymentNumber: "789456123",
    porb: "123456789",
    type1: "ชนิด 1",
    partsInsurance: "ประกันอะไหล่",
    emergencyAssistance: "ช่วยเหลือฉุกเฉิน",
    ev3: "EV3.0",
  },
  {
    date: "2024-12-01",
    dealer: "Dealer B",
    model: "Model Y",
    vinNo: "67890FGHIJ",
    customerName: "นาง สุดารัตน์",
    insuranceCompany: "บริษัท XYZ",
    coverage: "ประกันภัยชั้น 1",
    expiration: "2026-12-01",
    paymentDate: "2024-12-01",
    paymentNumber: "456123789",
    porb: "987654321",
    type1: "ชนิด 2",
    partsInsurance: "ประกันอะไหล่",
    emergencyAssistance: "ช่วยเหลือฉุกเฉิน",
    ev3: "EV4.0",
  },
];

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disPlay, setDisPlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = router.query;
  console.log('vin', vin);


  // useEffect(() => {
  //   fetchData(vin)
  // }, []);
  const fetchData = async (vin) => {
    try {
      // const response = await axios.get(`${API_URL}showData`);
      // const response = await axios.get(`${API_URL}getdata_main`);

      const response = await axios.post(`${API_URL}getdata_detail`, { vin: vin }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="m-5 pl-8">
        <h1 className="text-2xl font-bold text-gray-800">ข้อมูลประกัน</h1>
        {/* <form className="max-w-md mt-5" onSubmit={handleSearch}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              value={searchQuery}
              onChange={handleChange}
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Vin No."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form> */}
      </div>

      {/* {loading ? (
        <div className="flex justify-center mt-5">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid">
            Loding...
          </div>
        </div>
      ) : null} */}


      {filteredData.length > 0 ? (
        <div className="pl-8">
          <div className="bg-white p-5 rounded">
            {filteredData.map((values, index) => (
              <div key={index}>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      วันที่เบิกรถ
                    </p>
                    <p className="font-semibold">{values.date}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Dealer
                    </p>
                    <p className="font-semibold">{values.dealer}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Model
                    </p>
                    <p className="font-semibold">{values.model}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Vin No.
                    </p>
                    <p className="font-semibold">{values.vinNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ชื่อลูกค้า
                    </p>
                    <p className="font-semibold">{values.customerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      บริษัทประกัน
                    </p>
                    <p className="font-semibold">
                      {values.insuranceCompany}
                    </p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      คุ้มครอง
                    </p>
                    <p className="font-semibold">{values.coverage}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      สิ้นสุด
                    </p>
                    <p className="font-semibold">{values.expiration}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      วันที่ชำระ
                    </p>
                    <p className="font-semibold">{values.paymentDate}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      เลขที่ชำระ
                    </p>
                    <p className="font-semibold">{values.paymentNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      พรบ
                    </p>
                    <p className="font-semibold">{values.porb}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ประเภท 1
                    </p>
                    <p className="font-semibold">{values.type1}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ประกันอะไหล่
                    </p>
                    <p className="font-semibold">{values.partsInsurance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      รถช่วยเหลือฉุกเฉิน
                    </p>
                    <p className="font-semibold">
                      {values.emergencyAssistance}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      EV 3.0
                    </p>
                    <p className="font-semibold">{values.ev3}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pl-12">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
      )}
    </>


  );
}

export default Page;
