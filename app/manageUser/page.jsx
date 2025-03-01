"use client";
import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Navbar from "../../components/navBar/Navbar";
import axios from "axios";
import numeral from "numeral";
import Swal from 'sweetalert2';
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
    ModalContent
} from "@nextui-org/react";

import { columns, statusOptions } from "./data";

import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/CustomTable";

const statusColorMap = {
    Done: "success",
    Progress: "primary",
    Rejected: "danger",
    Hold: "default",
};

const INITIAL_VISIBLE_COLUMNS = [
    "name",
    // "username",
    "email",
    "password",
    'role',
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
    const [isModalPermissionOpen, setIsModalPermissionOpen] = useState(false);
    const [detailData, setDetailData] = useState({
        vin_no: '',
        document: '',
        registration: '',
        registration_book: '',
        remark_detail: ''
    });
    const [permissions, setPermissions] = useState([]);
    const [userId, setUserId] = useState();


    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();
    let showData = useSelector((state) => state.showData.showData);

    useEffect(() => {
        fetchData();
    }, [dispatch, API_URL]);



    const fetchData = async (page) => {
        try {
            // const response = await axios.get(`${API_URL}showData`);
            // const response = await axios.get(`${API_URL}getdata_main`);
            // const response = await axios.get(`${API_URL}getall_user`);
            // const responseMenu = await axios.get(`${API_URL}getall_menu`);
            // setData(response.data);
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

    const openModal = async (id) => {

        try {
            // const response = await axios.get(`${API_URL}showData`);

            const response = await axios.post(`${API_URL}detail_user`, { id: id }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('response detail', response);
            if (response.data.length > 0) {
                setDetailData(response.data[0]);
            }


            // setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openPermissionModal = async (id) => {

        try {
            // const response = await axios.get(`${API_URL}showData`);

            const response = await axios.post(`${API_URL}detail_permission`, { user_id: id }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.length > 0) {
                setPermissions(response.data);

            }
            setUserId(id);

            // setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsModalPermissionOpen(true);
    };

    const closePermissionModal = () => {
        setPermissions([])
        setIsModalPermissionOpen(false);

    };



    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-end">
                        <Button size="sm" onClick={() => openModal(item["id"])} color="primary">Edit</Button>
                        <Button size="sm" onClick={() => openPermissionModal(item["id"])} color="primary">Permission</Button>
                    </div>
                );

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
    };

    const handleSubmit = async (e) => {


        await setLoadingModal(true)
        e.preventDefault();

        // Collect form data using FormData API
        const form = e.target;
        const formData = new FormData(form);

        // Convert FormData to JSON
        const formJSON = Object.fromEntries(formData.entries());

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
        console.log('permissions.user_id', userId);


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
                setIsModalPermissionOpen(true)
                try {
                    const response = await fetch(`${API_URL}edit_permission`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ permissions, user_id: userId })
                    });
                    console.log('response', response);


                    if (response.ok) {

                        // setIsLoading(true)
                        await fetchData()

                        Swal.fire({
                            title: 'Success',
                            // text: 'The form has been submitted successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });

                        setIsModalPermissionOpen(false);
                    } else {
                        Swal.fire({
                            title: 'Failed',
                            text: 'There was an issue with the submission. Please try again',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                        setIsModalPermissionOpen(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred.');
                } finally {
                    setLoadingModal(false)
                    setPermissions([])
                }
            } else {
                setIsModalPermissionOpen(true)
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
            {isModalOpen && (
                <Modal isOpen={isModalOpen} size={"md"} hideCloseButton={true} onClose={closeModal}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                                <ModalBody>
                                    <form id="modalForm" onSubmit={handleSubmit}>
                                        <Input label="ชื่อ"
                                            type="text"
                                            value={detailData.name ? detailData.name : ''}
                                            id="name"
                                            name="name"
                                            onChange={handleChange}
                                            className="mb-4"
                                        />
                                        <Input label="ชื่อผู้ใช้งาน"
                                            type="text"
                                            value={detailData.username ? detailData.username : ''}
                                            id="username"
                                            name="username"
                                            onChange={handleChange}
                                            className="mb-4"
                                        />
                                        <Input label="อีเมลล์"
                                            type="text"
                                            value={detailData.email ? detailData.email : ''}
                                            id="email"
                                            name="email"
                                            onChange={handleChange}
                                            className="mb-4"
                                        />
                                        <Input label="รหัสผ่าน"
                                            type="password"
                                            value={detailData.salt ? detailData.salt : ''}
                                            id="salt"
                                            name="salt"
                                            onChange={handleChange}
                                            className="mb-4"
                                        />
                                        <Input
                                            type="hidden"
                                            id="id"
                                            name="id"
                                            value={detailData.id ? detailData.id : ''}
                                        />

                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    {
                                        loadingModal ? (
                                            <Button isLoading color="primary">
                                                Loading
                                            </Button>
                                        ) :
                                            <>
                                                <Button color="danger" variant="light" onPress={onClose} disabled={loadingModal}>
                                                    Close
                                                </Button>
                                                <Button color="primary" type="submit" form="modalForm" disabled={loadingModal}>
                                                    Submit
                                                </Button>
                                            </>
                                    }
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
            {isModalPermissionOpen && (
                <Modal isOpen={isModalPermissionOpen} size={"3xl"} hideCloseButton={true} onClose={closePermissionModal}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">สิทธิการใช้งาน</ModalHeader>
                                <ModalBody>
                                    <form id="modalPermissionForm" onSubmit={handlePermissionSubmit}>
                                        <table className="table-auto w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr>

                                                    <th className="border border-gray-300 px-4 py-2">menu</th>
                                                    <th className="border border-gray-300 px-4 py-2">view</th>
                                                    <th className="border border-gray-300 px-4 py-2">create</th>
                                                    <th className="border border-gray-300 px-4 py-2">edit</th>
                                                    <th className="border border-gray-300 px-4 py-2">delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {allMenu.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-300 px-4 py-2">{item.name || ""}</td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                name="is_view"
                                                                checked={permissions.find(permission => permission.menu === item.code && permission.is_view == 1) ? true : false}

                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                name="is_create"
                                                                checked={permissions.find(permission => permission.menu === item.code && permission.is_create == 1) ? true : false}

                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                name="is_edit"
                                                                checked={permissions.find(permission => permission.menu === item.code && permission.is_edit == 1) ? true : false}

                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                name="is_delete"
                                                                checked={permissions.find(permission => permission.menu === item.code && permission.is_delete == 1) ? true : false}

                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                        </td>

                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    {loadingModal ? (
                                        <Button isLoading color="primary">Loading</Button>
                                    ) : (
                                        <>
                                            <Button color="danger" variant="light" onPress={onClose} disabled={loadingModal}>
                                                Close
                                            </Button>
                                            <Button color="primary" type="submit" form="modalPermissionForm" disabled={loadingModal}>
                                                Submit
                                            </Button>
                                        </>
                                    )}
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            )}


            {/* {data.length > 0 && isLoading == false ? */}
            <CustomTable
                columns={headerColumns}
                data={data}
                renderFunction={renderCell}
                rowsPerPage={10}
                searchInColumn={true}
                defaultColumn={columns[1].key}
                topContent={"จัดการสิทธิผู้ใช้งาน"}
                isAdd={true}

            />
            {/* : <div className="flex h-screen justify-center items-center">
          <Spinner size="lg" label="Loading...." />
        </div>
      } */}
        </div>
    );
}


