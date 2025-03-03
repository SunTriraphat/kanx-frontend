"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense, useRef } from "react";
import Navbar from "../../components/navBar/Navbar";
import axios from "axios";
import numeral from "numeral";
import Swal from 'sweetalert2';
import SignatureCanvas from 'react-signature-canvas';
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
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
    Spinner,
    Tooltip,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
    Textarea,
    RadioGroup,
    Radio
} from "@nextui-org/react";

import { columns, statusOptions } from "./data";

import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/CustomTable";
import CustomModal from "../../components/CustomModal";
import { send } from "process";

const statusColorMap = {
    Done: "success",
    Progress: "primary",
    Rejected: "danger",
    Hold: "default",
};

const INITIAL_VISIBLE_COLUMNS = [
    "contract_no",
    "contract_status",
    "buyer_title",
    "buyer_firstname",
    "buyer_lastname",
    "actions",
];


export default function App() {
    const [data, setData] = useState([]);
    const [allMenu, setAllMenu] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "dealer_code",
        direction: "ascending",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSendFormOpen, setIsModalSendFormOpen] = useState(false);
    const [detailData, setDetailData] = useState({
        vin_no: '',
        document: '',
        registration: '',
        registration_book: '',
        remark_detail: ''
    });
    const [permissions, setPermissions] = useState([]);
    const [userId, setUserId] = useState();
    const [province, setProvince] = useState([]);
    const sigCanvas = useRef(null);

    // ฟังก์ชันเคลียร์ลายเซ็น
    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    // ฟังก์ชันรับค่าลายเซ็นในรูปแบบ Data URL
    const saveSignature = () => {
        const signatureData = sigCanvas.current.toDataURL();

      
    };

    //radio button 
    const [addressType, setAddressType] = useState("old");
    const [jobAddressType, setJobAddressType] = useState("old");
    const [jobType, setJobType] = useState("old");
    const [extraJobs, setExtraJobs] = useState([]);

    const handleAddExtraJob = () => {
        setExtraJobs([...extraJobs, { job_name: "", job_year: "" }]);
    };

    const handleChangeExtraJob = (id, field, value) => {
        setExtraJobs(extraJobs.map(job => (job.id === id ? { ...job, [field]: value } : job)));
    };



    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();
    let showData = useSelector((state) => state.showData.showData);

    useEffect(() => {
        fetchData();
    }, [dispatch, API_URL]);


    const fetchData = async (page) => {
        try {
            const responseProvince = await axios.get(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json`);
            const response = await axios.get(`${API_URL}/contracts/all`);
            

            // const responseMenu = await axios.get(`${API_URL}getall_menu`);
            setData(response.data);
            setProvince(responseProvince.data)
            // setAllMenu(responseMenu.data);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.key)
        );
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredData = [...showData];


        if (hasSearchFilter) {
            filteredData = filteredData.filter((item) =>
                item.vin_no.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredData = filteredData.filter((item) =>
                Array.from(statusFilter).includes(item.status)
            );
        }

        return filteredData;
    }, [showData, filterValue, statusFilter]);

    const sendSMS = async (contract_no) => {

        Swal.fire({
            title: "ยืนยันการส่ง SMS ?",
            // text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Loading...",
                    text: "กรุณารอสักครู่",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                try {
                    // const response = await axios.get(`${API_URL}showData`);

                    const response = await axios.post(`${API_URL}/contracts/send-sms`, { contract_no: contract_no }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    
                    if (response.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "ดําเนินการสําเร็จ",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        fetchData();
                    }


                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        })

        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openSendFormModal = async (contract_no) => {
        
        setIsModalSendFormOpen(true);

    };

    const closeSendFormModal = () => {
        setPermissions([])
        setIsModalSendFormOpen(false);

    };



    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-end">
                        <Button size="sm" onClick={() => sendSMS(item["contract_no"])} color="primary">มอบหมายงาน</Button>
                        <Button size="sm" onClick={() => openSendFormModal(item["contract_no"])} color="primary">form</Button>
                    </div>
                );


            default:
                return cellValue;
        }
    };

    const handleSubmit = async (e) => {

        const signatureData = sigCanvas.current.toDataURL();
        await setLoadingModal(true)
        e.preventDefault();

        // Collect form data using FormData API
        const form = e.target;
        const formData = new FormData(form);
        for (let i = 0; i < extraJobs.length; i++) {

            formData.append('extrajob', extraJobs[i]);
        }
        formData.append('signature', signatureData);
        // Convert FormData to JSON
        const formJSON = Object.fromEntries(formData.entries());
        
        return false;


        Swal.fire({
            title: "ยืนยันการแก้ไขข้อมูล?",
            // text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsModalOpen(true)
                try {
                    const response = await fetch(`${API_URL}edit_user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formJSON),
                    });


                    if (response.ok) {
                        form.reset(); // Reset the form after successful submission
                        // setIsLoading(true)
                        await fetchData()

                        Swal.fire({
                            title: 'Success',
                            // text: 'The form has been submitted successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                        setIsModalOpen(false);
                    } else {
                        Swal.fire({
                            title: 'Failed',
                            text: 'There was an issue with the submission. Please try again',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                        setIsModalOpen(false);
                        form.reset();
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred.');
                } finally {
                    setLoadingModal(false)
                }
            } else {
                setIsModalOpen(true)
                setLoadingModal(false)
            }
        });


    };
    const handlePermissionSubmit = async (e) => {
        await setLoadingModal(true)
        e.preventDefault();
    
        Swal.fire({
            title: "ยืนยันการแก้ไขสิทธิการใช้งาน?",
            // text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsModalSendFormOpen(true)
                try {
                    const response = await fetch(`${API_URL}edit_permission`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ permissions, user_id: userId })
                    });
                   


                    if (response.ok) {

                        // setIsLoading(true)
                        await fetchData()

                        Swal.fire({
                            title: 'Success',
                            // text: 'The form has been submitted successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });

                        setIsModalSendFormOpen(false);
                    } else {
                        Swal.fire({
                            title: 'Failed',
                            text: 'There was an issue with the submission. Please try again',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                        setIsModalSendFormOpen(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred.');
                } finally {
                    setLoadingModal(false)
                    setPermissions([])
                }
            } else {
                setIsModalSendFormOpen(true)
                setLoadingModal(false)
            }
        });


    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetailData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleCheckboxChange = (event, item) => {
        const { name, checked } = event.target;

        setPermissions((prevPermissions) => {
            // Check if the menu already exists in the permissions array by `item.code`
            const existingIndex = prevPermissions.findIndex((perm) => perm.menu === item.code);

            if (existingIndex > -1) {
                // Update the existing menu permissions
                const updatedPermissions = [...prevPermissions];
                updatedPermissions[existingIndex][name] = checked ? 1 : 0;
                return updatedPermissions;
            } else {
                // Add a new menu permission
                return [
                    ...prevPermissions,
                    {
                        menu: item.code,
                        is_view: name === "is_view" ? (checked ? 1 : 0) : 0,
                        is_create: name === "is_create" ? (checked ? 1 : 0) : 0,
                        is_edit: name === "is_edit" ? (checked ? 1 : 0) : 0,
                        is_delete: name === "is_delete" ? (checked ? 1 : 0) : 0,
                    },
                ];
            }
        });
    };



    return (
        <div>
            <Navbar />

            {isModalSendFormOpen && (
                <>
                    <CustomModal
                        isOpen={isModalSendFormOpen}
                        onClose={() => closeSendFormModal()}
                        size="xl"
                        color="gray-200"
                        footer={
                            <div className="flex justify-end">
                                {
                                    loadingModal ? (
                                        <Button isLoading color="primary">
                                            Loading
                                        </Button>
                                    ) :
                                        <>
                                            <Button color="danger" variant="light" onPress={() => closeSendFormModal()} disabled={loadingModal}>
                                                Close
                                            </Button>
                                            <Button color="primary" type="submit" form="modalForm" disabled={loadingModal}>
                                                Submit
                                            </Button>
                                        </>

                                }
                            </div>
                        }
                    >
                        <form id="modalForm" onSubmit={handleSubmit} className="grid gap-4">
                            <Input
                                type="hidden"
                                id="contract_no"
                                name="contract_no"
                                value={data.contract_no || ''}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="first_name" className="block text-gray-700 font-medium mb-1">
                                        ชื่อ:
                                    </label>
                                    <Input
                                        type="text"

                                        id="first_name"
                                        name="first_name"
                                        onChange={handleChange}
                                        className="w-full"
                                    // disabled
                                    />

                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-gray-700 font-medium mb-1">
                                        นามสกุล:
                                    </label>
                                    <Input
                                        type="text"

                                        id="last_name"
                                        name="last_name"
                                        onChange={handleChange}
                                        className="w-full"

                                    />
                                </div>

                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">ที่อยู่ปัจจุบันตรงตาที่แจ้งหรือไม่:</label>
                                <div className="flex items-center gap-4">
                                    <RadioGroup value={addressType} onValueChange={setAddressType} orientation="horizontal">
                                        <Radio value="old">ใช่</Radio>
                                        <Radio value="new">ไม่ใช่ ระบุ(ด้านล่าง)</Radio>
                                    </RadioGroup>
                                </div>

                                {addressType === "new" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="address_no" className="block text-gray-700 font-medium mb-1">
                                                เลขที่:
                                            </label>
                                            <Input
                                                type="text"
                                                id="address_no"
                                                name="address_no"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="moo" className="block text-gray-700 font-medium mb-1">
                                                หมู่ที่:
                                            </label>
                                            <Input
                                                type="text"
                                                id="moo"
                                                name="moo"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="village" className="block text-gray-700 font-medium mb-1">
                                                หมู่บ้าน/อาคาร:
                                            </label>
                                            <Input
                                                type="text"
                                                id="village"
                                                name="village"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="floor" className="block text-gray-700 font-medium mb-1">
                                                ชั้น:
                                            </label>
                                            <Input
                                                type="text"
                                                id="floor"
                                                name="floor"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="soi" className="block text-gray-700 font-medium mb-1">
                                                ซอย:
                                            </label>
                                            <Input
                                                type="text"
                                                id="soi"
                                                name="soi"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="road" className="block text-gray-700 font-medium mb-1">
                                                ถนน:
                                            </label>
                                            <Input
                                                type="text"
                                                id="road"
                                                name="road"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="sub_district" className="block text-gray-700 font-medium mb-1">
                                                แขวง/ตำบล:
                                            </label>
                                            <Input
                                                type="text"
                                                id="sub_district"
                                                name="sub_district"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="district" className="block text-gray-700 font-medium mb-1">
                                                เขต/อำเภอ:
                                            </label>
                                            <Input
                                                type="text"
                                                id="district"
                                                name="district"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="province" className="block text-gray-700 font-medium mb-1">
                                                จังหวัด:
                                            </label>
                                            <Input
                                                type="text"
                                                id="province"
                                                name="province"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="zip_code" className="block text-gray-700 font-medium mb-1">
                                                รหัสไปรษณีย์:
                                            </label>
                                            <Input
                                                type="text"
                                                id="zip_code"
                                                name="zip_code"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">อาชีพหลักตรงตาที่แจ้งหรือไม่:</label>
                                <div className="flex items-center gap-4">
                                    <RadioGroup value={jobType} onValueChange={setJobType} orientation="horizontal">
                                        <Radio value="old">ใช่</Radio>
                                        <Radio value="new">ไม่ ระบุ(ด้านล่าง)</Radio>
                                    </RadioGroup>
                                </div>

                                {jobType === "new" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="address_no" className="block text-gray-700 font-medium mb-1">
                                                    อาชีพ:
                                                </label>
                                                <Input
                                                    type="text"
                                                    id="job_name"
                                                    name="job_name"
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />

                                            </div>
                                            <div>
                                                <label htmlFor="job_year" className="block text-gray-700 font-medium mb-1">
                                                    อายุงาน(ปี):
                                                </label>
                                                <Input
                                                    type="number"
                                                    id="job_year"
                                                    name="job_year"
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />

                                            </div>
                                            <div className="mt-4">
                                                <Button onClick={handleAddExtraJob} color="primary">เพิ่มอาชีพเสริม</Button>
                                            </div>
                                        </div>
                                        <div >
                                            {extraJobs.map((job, index) => (
                                                <div key={index} className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="job_name" className="block text-gray-700 font-medium mb-1">อาชีพเสริม {index + 1} :</label>
                                                        <Input
                                                            type="text"
                                                            value={job.job_name}
                                                            onChange={(e) => handleChangeExtraJob(job.id, "job_name", e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <label htmlFor="job_year" className="block text-gray-700 font-medium mb-1">อายุงาน(ปี):</label>
                                                        <Input
                                                            type="number"
                                                            value={job.job_year}
                                                            onChange={(e) => handleChangeExtraJob(job.id, "job_year", e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>

                                )}
                            </div>
                            <div>

                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">ที่อยู่ที่ทำงานตรงตาที่แจ้งหรือไม่:</label>
                                <div className="flex items-center gap-4">
                                    <RadioGroup value={jobAddressType} onValueChange={setJobAddressType} orientation="horizontal">
                                        <Radio value="old">ใช่</Radio>
                                        <Radio value="new">ไม่ใช่ ระบุ(ด้านล่าง)</Radio>
                                    </RadioGroup>
                                </div>

                                {jobAddressType === "new" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="job_address_no" className="block text-gray-700 font-medium mb-1">
                                                เลขที่:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_address_no"
                                                name="job_address_no"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_moo" className="block text-gray-700 font-medium mb-1">
                                                หมู่ที่:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_moo"
                                                name="job_moo"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="village" className="block text-gray-700 font-medium mb-1">
                                                หมู่บ้าน/อาคาร:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_village"
                                                name="job_village"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_floor" className="block text-gray-700 font-medium mb-1">
                                                ชั้น:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_floor"
                                                name="job_floor"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_soi" className="block text-gray-700 font-medium mb-1">
                                                ซอย:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_soi"
                                                name="job_soi"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_road" className="block text-gray-700 font-medium mb-1">
                                                ถนน:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_road"
                                                name="job_road"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_sub_district" className="block text-gray-700 font-medium mb-1">
                                                แขวง/ตำบล:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_sub_district"
                                                name="job_sub_district"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_district" className="block text-gray-700 font-medium mb-1">
                                                เขต/อำเภอ:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_district"
                                                name="job_district"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_province" className="block text-gray-700 font-medium mb-1">
                                                จังหวัด:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_province"
                                                name="job_province"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                        <div>
                                            <label htmlFor="job_zip_code" className="block text-gray-700 font-medium mb-1">
                                                รหัสไปรษณีย์:
                                            </label>
                                            <Input
                                                type="text"
                                                id="job_zip_code"
                                                name="job_zip_code"
                                                onChange={handleChange}
                                                className="w-full"
                                            />

                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="grid  gap-4">
                                <div>
                                    <label htmlFor="่job_type" className="block text-gray-700 font-medium mb-1">
                                        ประเภทกิจการ:
                                    </label>
                                    <Input
                                        type="text"

                                        id="่job_type"
                                        name="่job_type"
                                        onChange={handleChange}
                                        className="w-full"
                                    // disabled
                                    />

                                </div>
                                <div>
                                    <label htmlFor="่job_place_name" className="block text-gray-700 font-medium mb-1">
                                        ขายเร่/แผงลอย/ตลาดนัด ชื่อสถานี่:
                                    </label>
                                    <Input
                                        type="text"

                                        id="่job_place_name"
                                        name="่job_place_name"
                                        onChange={handleChange}
                                        className="w-full"
                                    // disabled
                                    />

                                </div>
                                <div>
                                    <label htmlFor="่job_date_open" className="block text-gray-700 font-medium mb-1">
                                        วันที่เปิดกิจการ:
                                    </label>
                                    <Input
                                        type="text"

                                        id="่job_date_open"
                                        name="่job_date_open"
                                        onChange={handleChange}
                                        className="w-full"
                                    // disabled
                                    />

                                </div>
                                <div>
                                    <label htmlFor="่job_time_open" className="block text-gray-700 font-medium mb-1">
                                        ระยะเวลาที่เปิดกิจการ:
                                    </label>
                                    <Input
                                        type="text"

                                        id="่job_time_open"
                                        name="่job_time_open"
                                        onChange={handleChange}
                                        className="w-full"
                                    // disabled
                                    />

                                </div>

                                <div>
                                    <label htmlFor="job_note" className="block text-gray-700 font-medium mb-1">
                                        ข้อสังเกตุจากการลงพื้นที่:
                                    </label>
                                    <Input
                                        type="text"
                                        id="job_note"
                                        name="job_note"
                                        onChange={handleChange}
                                        className="w-full"

                                    />
                                </div>

                            </div>
                            <div >
                                <h2>ลายเซ็นดิจิตอล</h2>
                                <div className="flex justify-center items-center ">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        backgroundColor="white"
                                        penColor="black"
                                        canvasProps={{ width: 300, height: 200, className: 'signature-canvas' }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <>
                                        <Button color="danger" onClick={clearSignature}>ล้างลายเซ็น</Button>
                                    </>
                                    <>
                                        <Button color="success" onClick={saveSignature}>บันทึกลายเซ็น</Button>
                                    </>

                                </div>

                            </div>
                        </form>
                    </CustomModal>
                </>
            )
            }


            {/* {data.length > 0 && isLoading == false ? */}
            <CustomTable
                columns={headerColumns}
                data={data}
                renderFunction={renderCell}
                rowsPerPage={10}
                searchInColumn={true}
                defaultColumn={columns[1].key}
                topContent={"ข้อมูลลูกค้า"}

            />

            {/* : <div className="flex h-screen justify-center items-center">
          <Spinner size="lg" label="Loading...." />
        </div>
      } */}
        </div >
    );
}


