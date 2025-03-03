"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import bcrypt from "bcryptjs";
import { useDispatch } from "react-redux";
import { addUser,addPermission } from "../store/slice/loginSlice";
import Popup from "../../components/Popup";
import CryptoJS from "crypto-js";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

function useFormValidation() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    remember: "",
  });

  const validate = () => {
    const newErrors = { email: "", password: "", remember: "" };
    let hasError = false;

    if (!values.email) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    if (!values.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    setErrors(newErrors);
    return !hasError;
  };

  return { values, setValues, errors, validate };
}

function Login() {
  const { values, setValues, errors, validate } = useFormValidation();
  const router = useRouter();
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const [popupContent, setPopupContent] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      // if (!key) {
      //   console.error("Encryption key is not defined.");
      //   return;
      // }

      try {
        // const hashedPassword = await bcrypt.hash(values.password, 10);
        // const response = await signIn("credentials", {
        //   redirect: false,
        //   email: values.email,
        //   password: values.password,
        // });
        const response = await axios.post(
          `${API_URL}/fe/auth/login`,
          values,
        );
       
        // Case login failed
        if (response.status === 401) {
          setPopupOpen(true);
          setPopupContent("Email or password is incorrect");
        }
        // Case login success
        if (response.status === 200) {
          console.log("ล็อคอินสำเร็จ");
          localStorage.setItem('isAuth', true);

          dispatch(addUser([response.data.data]));
          // const permission = await axios.post(`${API_URL}get_user_permission`, {
          //   id: response.data.data.id,
          // });
          // console.log('permission',permission);
          // dispatch(addPermission([permission.data]));
        
          // localStorage.setItem("user", JSON.stringify(response.data.data));

          router.push("/homepage");
        } else {
          console.error("Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <div className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-500"
            >
              Your email
            </label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              value={values.email}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-white dark:border-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@flowbite.com"
            />
            {errors.email && (
              <div className="text-red-500 mb-4 text-sm">{errors.email}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-500"
            >
              Your password
            </label>
            <input
              onChange={handleChange}
              type="password"
              id="password"
              name="password"
              value={values.password}
              placeholder="******"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-white dark:border-gray-100 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.password && (
              <div className="text-red-500 mb-4 text-sm">{errors.password}</div>
            )}
          </div>
          {/* <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-500"
            >
              Remember me
            </label>
          </div> */}
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        content={popupContent}
        title="Login failed"
      />
    </div>
  );
}

export default Login;
