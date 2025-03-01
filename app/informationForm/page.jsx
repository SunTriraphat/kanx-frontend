"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Navbar from "../../components/navBar/Navbar";
import axios from "axios";
import numeral from "numeral";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner
} from "@nextui-org/react";
import { PlusIcon } from "./Pluslcon";
import { VerticalDotsIcon } from "./VerticalDotslcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { addShowData } from "../store/slice/showDataSlice";
import CustomTable from "../../components/CustomTable";
import { Link } from "next/link"

const statusColorMap = {
  Done: "success",
  Progress: "primary",
  Rejected: "danger",
  Hold: "default",
};

const INITIAL_VISIBLE_COLUMNS = [
  "DateTimeUtc",
  "policy_no",
  "start_date",
  "end_date",
  "brand",
  "Model",
  "vin_no",
  "InsuranceProvider",
  "stock",
  "payment_month",
  "date_recieved",
  "remark",
  // "actions",
];


export default function App() {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState();

  const [totalRecord, setTotalRecord] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "dealer_code",
    direction: "ascending",
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();



  useEffect(() => {
    fetchData();
  }, [dispatch, API_URL]);

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue]);


  const formatDateToDMY = (date) => {
    if (!date) return ""; // Handle cases where the date might be undefined
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const addOneYearAndFormat = (date) => {


    if (!date) {
      return "";
    } else {
      const inputDate = new Date(date); // Parse the input date

      // inputDate.setFullYear(inputDate.getFullYear() + 1); // Add one year
      // return formatDateToDMY(inputDate); // Format using the existing function
    }
  };

  const formatDate = (date) => {
    if (!date) return null; // Return null if date is falsy

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0'); // Add leading zero for single digits
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero for single digits
    const year = d.getFullYear() // Get last two digits of the year

    return `${day}/${month}/${year}`;
  };

  const addOneYear = (date) => {
    if (!date) return null;

    const d = new Date(date);
    d.setFullYear(d.getFullYear() + 1); // Add 1 year to the current date
    return formatDate(d); // Format and return the new date
  };

  // const fetchData = async () => {

  //   try {

  //     const response = await axios.post(`${API_URL}getall_data`);
  //     const responseInsurance = await axios.get(`${API_URL}getall_insurance`);

  //     if (response.data && responseInsurance.data) {
  //       const sortedData = response.data.map(item => {
  //         // Find the matching insurance object
  //         const matchingInsurance = responseInsurance.data.find(
  //           insurance => insurance.vin_no === item.Vin
  //         );

  //         return matchingInsurance
  //           ? {
  //             ...item,
  //             policy_no: matchingInsurance.policy_no,
  //             start_date: formatDate(item.EffectiveDateStart),
  //             end_date: addOneYear(item.EffectiveDateStart),
  //             payment_month: matchingInsurance.payment_month,
  //             remark: matchingInsurance.remark,
  //             DateTimeUtc: formatDate(item.DateTimeUtc),
  //             brand: 'byd'
  //           }
  //           : {
  //             ...item,
  //             policy_no: null,
  //             start_date: formatDate(item.EffectiveDateStart),
  //             end_date: addOneYear(item.EffectiveDateStart),
  //             payment_month: null,
  //             remark: null,
  //             DateTimeUtc: formatDate(item.DateTimeUtc),
  //             brand: 'byd'
  //           };
  //       })

  //       setData(sortedData);
  //     }
  //     setIsLoading(false)
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // New fetch data mapping using Lookup Table
  const fetchData = async () => {
    try {
      const [response, responseInsurance] = await Promise.all([
        axios.post(`${API_URL}getall_data`),
        axios.get(`${API_URL}getall_insurance`)
      ]);
  
      if (response.data && responseInsurance.data) {
        // สร้าง Lookup Table insurance
        const insuranceLookup = responseInsurance.data.reduce((acc, insurance) => {
          acc[insurance.vin_no] = insurance;
          return acc;
        }, {});
  
        const sortedData = response.data.map(item => {
          const matchingInsurance = insuranceLookup[item.Vin];
  
          return {
            ...item,
            policy_no: matchingInsurance ? matchingInsurance.policy_no : null,
            start_date: formatDate(item.EffectiveDateStart),
            end_date: addOneYear(item.EffectiveDateStart),
            payment_month: matchingInsurance ? matchingInsurance.payment_month : null,
            remark: matchingInsurance ? matchingInsurance.remark : null,
            DateTimeUtc: formatDate(item.DateTimeUtc),
            brand: 'byd'
          };
        });
  
        setData(sortedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns]);

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "vin_no":
        return <a style={{ textDecoration: 'underline' }} href={`/carDetail?vin=${cellValue}`}>{cellValue}</a>
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue] || "default"}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }

  return (
    <div className="">
      <Navbar />
      {data.length > 0 ?
        <CustomTable
          columns={headerColumns}
          data={data}
          renderFunction={renderCell}
          rowsPerPage={10}
          searchInColumn={true}
          defaultColumn={columns[6].key}
          topContent={"ตรวจสอบการแจ้งประกันภัย/ชำระเบี้ย"}
          isImport={true}

        />
        :
        <div className="flex h-screen justify-center items-center">
          <Spinner size="lg" label="Loading...." />
        </div>

      }

    </div>


  );
}


