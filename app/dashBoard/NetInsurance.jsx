import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
function NetInsurance({ startDate, endDate, option }) {
  const [insuranceData, setInsuranceData] = useState([]);
  const [insuranceDenza, setInsuranceDenza] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ew, setEw] = useState([]);

  const fetchData = async () => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(`${API_URL}getbyd_summary`, { params });
      const premiumData = response.data.premium;

      setInsuranceData(premiumData);
      setEw(response.data.premium_ew);
    } catch (error) {
      console.error("Error fetching BYD data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDenza = async () => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(`${API_URL}getdenza_summary`, {
        params,
      });
      const premiumData = response.data.premium;
      // console.log("premiumDataDanza", premiumData);
      setInsuranceDenza(premiumData);
    } catch (error) {
      console.error("Error fetching BYD data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate || endDate) {
      fetchData();
      fetchDataDenza();
    }
  }, [startDate, endDate]);

  const totalVoluntary = Object.values(insuranceData).reduce(
    (acc, item) => acc + item.total_pre,
    0
  );
  const totalEW = Object.values(ew).reduce(
    (acc, item) => acc + item.total_ew,
    0
  );
  const totalCompulsory = Object.values(insuranceData).reduce(
    (acc, item) => acc + item.total_prb,
    0
  );

  const totalNetPremiumByd = totalVoluntary + totalCompulsory + totalEW;

  // Total Denza
  const totalVoluntaryDenza = Object.values(insuranceDenza).reduce(
    (acc, item) => acc + item.total_pre,
    0
  );

  const totalCompulsoryDenzq = Object.values(insuranceDenza).reduce(
    (acc, item) => acc + item.total_prb,
    0
  );
  const totalNetPremiumDenza = totalVoluntaryDenza + totalCompulsoryDenzq;

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg  ">
        <div className="flex flex-col justify-center items-center h-full space-y-2">
          <p className="text-gray-700 text-lg font-semibold text-center">
            ไม่มีข้อมูลที่แสดงในขณะนี้
          </p>
          <p className="text-gray-500 text-sm text-center">
            โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
          </p>
          <div className="flex flex-row justify-center items-end space-x-4 relative  ">
            <div className="circle animate-circle delay-0" />
            <div className="circle animate-circle delay-1" />
            <div className="circle animate-circle delay-2" />
            <div className="circle animate-circle delay-3" />
          </div>
        </div>
      </div>
    );
  } else if (insuranceData.length === 0 && insuranceDenza.length === 0) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-5 min-h-[50vh] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-2">
          <p className="text-gray-700 text-lg font-semibold text-center">
            ไม่มีข้อมูลที่แสดงในขณะนี้
          </p>
          <p className="text-gray-500 text-sm text-center">
            โปรดลองอีกครั้งในภายหลัง หรือเลือกช่วงเวลาที่แตกต่าง
          </p>
          <div className="flex flex-row justify-center items-end space-x-4 relative">
            <div className="circle animate-circle delay-0" />
            <div className="circle animate-circle delay-1" />
            <div className="circle animate-circle delay-2" />
            <div className="circle animate-circle delay-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {option === "byd" ? (
        <>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-10">
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8  py-4">
                {/* First Section */}

                <div className="bg-[#fef2f2] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                  <p className="font-bold text-2xl text-center mb-4 ">
                    Voluntary
                  </p>
                  <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                    <div className="text-center">Insurance</div>
                    <div className="text-center">Amount</div>
                    <div className="text-center">Net Premium</div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {Object.entries(insuranceData).map(([key, data], index) => (
                      <div key={index}>
                        <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                          <div className="text-center">
                            {key.replace(/_/g, " ")}
                          </div>
                          <div className="text-center">{data?.amount}</div>
                          <div className="text-center">
                            {new Intl.NumberFormat().format(data?.total_pre)}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all mt-4">
                      <div className="text-center font-semibold">
                        รวมทั้งหมด
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(insuranceData).reduce(
                            (acc, item) => acc + item.amount,
                            0
                          )
                        )}
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(totalVoluntary)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fffbeb] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                  <p className="font-bold text-2xl text-center mb-4 ">
                    Compulsory
                  </p>
                  <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                    <div className="text-center">Insurance</div>
                    <div className="text-center">Amount</div>
                    <div className="text-center">Net Premium</div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {Object.entries(insuranceData).map(([key, data], index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all"
                      >
                        <div className="text-center">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="text-center">
                          {new Intl.NumberFormat().format(data.amount)}
                        </div>
                        <div className="text-center">
                          {new Intl.NumberFormat().format(data.total_prb)}
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                      <div className="text-center font-semibold">
                        รวมทั้งหมด
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(insuranceData).reduce(
                            (acc, item) => acc + item.amount,
                            0
                          )
                        )}
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(totalCompulsory)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Ew */}
                <div className="bg-[#f0fdf4] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                  <p className="font-bold text-2xl text-center mb-4 ">EW</p>
                  <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                    <div className="text-center">Ew</div>
                    <div className="text-center">Amount</div>
                    <div className="text-center">Net Premium</div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                      <div className="text-center font-semibold">
                        รวมทั้งหมด
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(ew).reduce(
                            (acc, item) => acc + item.amount,
                            0
                          )
                        )}
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(totalEW)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2  py-7 px-7 bg-gray-100 rounded-lg mt-4 justify-center items-center">
                <div className="text-center font-semibold text-lg text-gray-700">
                  <p>Total</p>
                </div>
                <div className="text-center text-gray-500 font-semibold text-lg">
                  {new Intl.NumberFormat().format(totalNetPremiumByd)}
                </div>
              </div>
            </>
          </div>
        </>
      ) : (
        // Denza
        <>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-10">
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8  ">
                <div className="bg-[#fef2f2] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                  <p className="font-bold text-2xl text-center mb-4 ">
                    Voluntary
                  </p>
                  <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                    <div className="text-center">Insurance</div>
                    <div className="text-center">Amount</div>
                    <div className="text-center">Net Premium</div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {Object.entries(insuranceDenza).map(
                      ([key, data], index) => (
                        <div key={index}>
                          <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                            <div className="text-center">
                              {key.replace(/_/g, " ")}
                            </div>
                            <div className="text-center">{data.amount}</div>
                            <div className="text-center">
                              {new Intl.NumberFormat().format(data.total_pre)}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all mt-4">
                      <div className="text-center font-semibold">
                        รวมทั้งหมด
                      </div>
                      <div className="text-center font-semibold">
                        {Object.values(insuranceDenza).reduce(
                          (acc, item) => acc + item.amount,
                          0
                        )}
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(insuranceDenza).reduce(
                            (acc, item) => acc + item.total_pre,
                            0
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fffbeb] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                  <p className="font-bold text-2xl text-center mb-4 ">
                    Compulsory
                  </p>
                  <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-600">
                    <div className="text-center">Insurance</div>
                    <div className="text-center">Amount</div>
                    <div className="text-center">Net Premium</div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {Object.entries(insuranceDenza).map(
                      ([key, data], index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all"
                        >
                          <div className="text-center">
                            {key.replace(/_/g, " ")}
                          </div>
                          <div className="text-center">
                            {new Intl.NumberFormat().format(data.amount)}
                          </div>
                          <div className="text-center">
                            {new Intl.NumberFormat().format(data.total_prb)}
                          </div>
                        </div>
                      )
                    )}
                    <div className="grid grid-cols-3 gap-4 text-sm py-3 px-4 rounded-lg shadow-sm transition-all">
                      <div className="text-center font-semibold">
                        รวมทั้งหมด
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(insuranceDenza).reduce(
                            (acc, item) => acc + item.amount,
                            0
                          )
                        )}
                      </div>
                      <div className="text-center font-semibold">
                        {new Intl.NumberFormat().format(
                          Object.values(insuranceDenza).reduce(
                            (acc, item) => acc + item.total_prb,
                            0
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2  py-7 px-7 bg-gray-100 rounded-lg mt-4 justify-center items-center">
                <div className="text-center font-semibold text-lg text-gray-700">
                  <p>Total</p>
                </div>
                <div className="text-center text-gray-500 font-semibold text-lg">
                  {new Intl.NumberFormat().format(totalNetPremiumDenza)}
                </div>
              </div>
            </>
          </div>
        </>
      )}
    </>
  );
}

export default NetInsurance;
