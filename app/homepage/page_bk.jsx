"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { addInsurance } from "../store/slice/insuranceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navBar/Navbar";

function Homepage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_BRAND = process.env.NEXT_PUBLIC_API_BRANDS;
  const userData = useSelector((state) => state.user.user);

  const [brand, setBrand] = useState([]);
  const [subBrand, setSubBrand] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [values, setValues] = useState({
    brand: "",
    model: "",
    dealer_code: "",
    account: "",
    vin: "",
    stock: "",
    date_recieved: "",
    date_accounted_sent: "",
    date_accounted: "",
    status: "",
    price: "",
    billing: "",
    date_payment: "",
    document: "test",
  });
  console.log("User ", userData);
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`${API_BRAND}/api/brands`);
        setBrand(response.data);
      } catch (error) {
        console.error("Fetch data Brand:", error.message);
      }
    };

    fetchBrand();
  }, [API_BRAND]);

  useEffect(() => {
    const fetchSubBrand = async () => {
      if (selectedBrandId) {
        try {
          const response = await axios.get(
            `${API_BRAND}/api/submodels/brand/${selectedBrandId}`
          );
          setSubBrand(response.data);
        } catch (error) {
          console.error("Fetch data Sub Brand:", error.message);
        }
      }
    };

    fetchSubBrand();
  }, [selectedBrandId, API_BRAND]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: files[0],
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      if (name === "brand") {
        setSelectedBrandId(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await axios.post(`${API_URL}submitData`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log("ส่งข้อมูลสำเร็จ:", response.data);
      dispatch(addInsurance([response.data.data]));
      router.push("/informationForm");
    } catch (error) {
      console.error("An error occurred while submitting the data:", error);
    }
  };

  // console.log("SubBrand", subBrand);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl w-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="dealer_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  รหัสตัวแทน
                </label>
                <input
                  type="text"
                  id="dealer_code"
                  name="dealer_code"
                  value={values.dealer_code}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="รหัสตัวแทน"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  จำนวน
                </label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={values.stock}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="จำนวน"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  ยี่ห้อรถ
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={values.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">ยี่ห้อรถ</option>
                  {brand.map((brands) => (
                    <option key={brands.id} value={brands.name}>
                      {brands.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700"
                >
                  รุ่น
                </label>
                <select
                  id="model"
                  name="model"
                  value={values.model}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">รุ่น</option>
                  {subBrand.map((subBrandItem) => (
                    <option key={subBrandItem.id} value={subBrandItem.name}>
                      {subBrandItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="vin"
                  className="block text-sm font-medium text-gray-700"
                >
                  เลขตัวถัง
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={values.vin}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="เลขตัวถัง"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  ราคา
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ราคา"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="account"
                  className="block text-sm font-medium text-gray-700"
                >
                  บัญชี / รายการ
                </label>
                <input
                  type="text"
                  id="account"
                  name="account"
                  value={values.account}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="บัญชี / รายการ"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="date_payment"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันที่ชำระ
                </label>
                <input
                  type="date"
                  id="date_payment"
                  name="date_payment"
                  value={values.date_payment}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date_recieved"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันรับบัญชี
                </label>
                <input
                  type="date"
                  id="date_recieved"
                  name="date_recieved"
                  value={values.date_recieved}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="date_accounted_sent"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันส่งบัญชี
                </label>
                <input
                  type="date"
                  id="date_accounted_sent"
                  name="date_accounted_sent"
                  value={values.date_accounted_sent}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date_accounted"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันลงบัญชี
                </label>
                <input
                  type="date"
                  id="date_accounted"
                  name="date_accounted"
                  value={values.date_accounted}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="billing"
                  className="block text-sm font-medium text-gray-700"
                >
                  วางบิล
                </label>
                <input
                  type="text"
                  id="billing"
                  name="billing"
                  value={values.billing}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="วางบิล"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="document"
                  className="block text-sm font-medium text-gray-700"
                >
                  เอกสารแนบ
                </label>
                <input
                  type="file"
                  name="document"
                  id="document"
                  onChange={handleChange}
                  // required
                  className="block w-full border mt-1 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-200 dark:border-neutral-300 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-50 dark:file:text-neutral-400"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  สถานะ
                </label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="Progress">In Progress</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hold">On hold</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white font-medium rounded-lg py-3 px-6 shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors duration-150 ease-in-out"
              >
                ส่งข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Homepage;
