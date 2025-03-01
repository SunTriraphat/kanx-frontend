"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/navBar/Navbar";

import axios from "axios";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [disPlay, setDisPlay] = useState(false);
  const [vin, setVin] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // const searchParams = useSearchParams();
  // let vin = searchParams.get('vin');
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vinParam = queryParams.get('vin');
    setVin(vinParam);
  }, []);

  useEffect(() => {
    if (vin) {
      fetchData(vin);
    }
  }, [API_URL, vin]);

  const fetchData = async (vin) => {
    try {
      const response = await axios.post(`${API_URL}getdata_detail`, { vin: vin }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      setFilteredData(response.data[0]);
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

      {filteredData ? (
        <>
          <div className="m-5 pl-8">
            <h1 className="text-2xl font-bold text-gray-800">General Vehicle</h1>
            <Divider style={{ width: "20%" }} />
          </div>
          <div className="pl-8">
            <div className="bg-white pl-5 rounded">
              <div >
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      วันที่เบิกรถ
                    </p>
                    <p className="font-semibold">{filteredData.date}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Dealer
                    </p>
                    <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Model
                    </p>
                    <p className="font-semibold">{filteredData.Model ? filteredData.Model : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Sub Model
                    </p>
                    <p className="font-semibold">{filteredData.SubModel ? filteredData.SubModel : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Vin No.
                    </p>
                    <p className="font-semibold">{filteredData.Vin ? filteredData.Vin : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Dealer
                    </p>
                    <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Date Delivery
                    </p>
                    <p className="font-semibold">{filteredData.Date_Delivery}</p>
                  </div>
                </div>

                <h1 className="mt-5 text-2xl font-bold text-gray-800">Insurance Effective</h1>
                <Divider style={{ width: "20%" }} />

                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ชื่อลูกค้า
                    </p>
                    <p className="font-semibold">{filteredData.CustomerFirstName} {filteredData.CustomerLastName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      บริษัทประกัน
                    </p>
                    <p className="font-semibold">
                      {filteredData.InsuranceProvider ? filteredData.InsuranceProvider : '-'}
                    </p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Dealer
                    </p>
                    <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Model
                    </p>
                    <p className="font-semibold">{filteredData.Model ? filteredData.Model : "-"}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      คุ้มครอง
                    </p>
                    <p className="font-semibold">{filteredData.start_date ? filteredData.start_date : "-"}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      สิ้นสุด
                    </p>
                    <p className="font-semibold">{filteredData.end_date ? filteredData.end_date : "-"}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Vin No.
                    </p>
                    <p className="font-semibold">{filteredData.Vin ? filteredData.Vin : "-"}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Dealer
                    </p>
                    <p className="font-semibold">{filteredData.DealershipName ? filteredData.DealershipName : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Finance
                    </p>
                    <p className="font-semibold">{filteredData.Date_Delivery}</p>
                  </div>

                </div>
                <h1 className="mt-5 text-2xl font-bold text-gray-800">Insurance Payment</h1>
                <Divider style={{ width: "20%" }} />
                <div className="grid grid-cols-5 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      บริษัทประกัน
                    </p>
                    <p className="font-semibold">
                      {filteredData.InsuranceProvider ? filteredData.InsuranceProvider : '-'}
                    </p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      กรมธรรม์
                    </p>
                    <p className="font-semibold">{filteredData.policy_no ? filteredData.policy_no : '-'}</p>
                  </div>

                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      คุ้มครอง
                    </p>
                    <p className="font-semibold">{filteredData.start_date ? filteredData.start_date : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      สิ้นสุด
                    </p>
                    <p className="font-semibold">{filteredData.end_date ? filteredData.end_date : '-'}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      Vin No.
                    </p>
                    <p className="font-semibold">{filteredData.Vin ? filteredData.Vin : '-'}</p>
                  </div>

                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      วันที่ชำระ
                    </p>
                    <p className="font-semibold">{filteredData.payment_month ? filteredData.payment_month : "-"}</p>
                  </div>
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      เลขที่ชำระ
                    </p>
                    <p className="font-semibold">{filteredData.paymentNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      พรบ
                    </p>
                    <p className="font-semibold">{filteredData.act_no ? filteredData.act_no : '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ประเภท 1
                    </p>
                    <p className="font-semibold">{filteredData.type1}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      ประกันอะไหล่
                    </p>
                    <p className="font-semibold">{filteredData.partsInsurance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      รถช่วยเหลือฉุกเฉิน
                    </p>
                    <p className="font-semibold">
                      {filteredData.emergencyAssistance}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-9">
                  <div className="mb-2 pb-2 border-b">
                    <p className="font-light text-sm text-gray-700 mb-1">
                      EV 3.0
                    </p>
                    <p className="font-semibold">{filteredData.ev3}</p>
                  </div>
                </div>
              </div>

            </div>
          </div></>

      ) : (
        <div className="pl-12">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
      )}

    </>
  );
}

export default Page;
