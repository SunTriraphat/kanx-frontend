import {
    Breadcrumbs,
    BreadcrumbItem,
    Input,
    Button,
    Link,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { use, useEffect } from "react";
import { useState } from "react";

import CustomTable from "../components/CustomTable";
import * as XLSX from "xlsx";

export default function VinStock({ onValueSend }) {


    const [isloading, setIsLoading] = useState(false); // สร้าง State สำหรับเก็บค่าการโหลดข้อมูล
    const [data, setData] = useState([]);
    const [lot, setLot] = useState("");
    const [isMounte, setIsMounte] = useState(true);

    // useEffect(() => {
    //     if (isMounte) {
    //         setIsMounte(false);
    //         fetchService.get("/api/dealer/service/current-lot").then((res) => {
    //             const curLot = res.config_value;
    //             setLot(curLot);
    //             loadData(curLot);
    //         });
    //     }
    // }, []);

    // const loadData = (lot) => {
    //     setIsLoading(true);
    //     fetchService.get("/api/dealer/stock/list/" + lot).then((res) => {
    //         setData(res);
    //         setIsLoading(false);
    //     });
    // }

    const handleGet = () => {
        loadData(lot);
    }

    const columns = [
        { key: "dealerId", label: "Dealer ID" },
        { key: "dealer_group", label: "Dealer Group" },
        { key: "model", label: "Model" },
        { key: "vin_no", label: "Vin No." },
        // { key: "action", label: "Action" },
    ];

    const renderFunction = (data, key) => {
        const cellValue = data[key];
        switch (key) {
            case 'action':
                return (
                    <div className="flex flex-row gap-2">
                        <Button color="success" size="sm" aria-label="Edit Stock">Edit</Button>
                        <Button color="error" size="sm" aria-label="Delete Stock">Delete</Button>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    // ฟังก์ชั่นอ่านไฟล์ Excel และแสดงข้อมูล
    const [excelData, setExcelData] = useState([]);
    const [excelUploadColumns, setExcelUploadColumns] = useState([]);
    const [fileName, setFileName] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const handleFileUpload =  (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target.result;
            // If you expect the file to be UTF-8 encoded text (not binary),
            // you can use TextDecoder to handle UTF-8 explicitly (for .txt or other text files)
            const utf8Data = new TextDecoder('utf-8').decode(data);
    
            const workbook = XLSX.read(utf8Data, { type: 'binary' });

            // const workbook = XLSX.read(data, { type: 'binary' });

            const sheetName = workbook.SheetNames[0]; // Use the first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet data to JSON
            const jsonDataHeader = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log('jsonData',jsonData);
            
            // // Add unique keys to each item
            const dataWithKeys = jsonData.map((item, index) => ({ ...item, key: index }));
            const headers = jsonDataHeader[0]; // Get the first row as headers
            const headerColumns = headers.map((header) => ({
                key: header,
                label: header,
            }));
            console.log('headerColumns',headerColumns);
            console.log('dataWithKeys',dataWithKeys);
            
            setExcelUploadColumns(headerColumns);
            await setExcelData(dataWithKeys); // Display data in table
            onValueSend(dataWithKeys);
        };
        reader.readAsArrayBuffer(file); // Reading the file as an array buffer to support UTF-8
        setFileName(file.name); // Store the uploaded file name
    };
    



    // ฟังก์ชั่นดาวน์โหลดไฟล์ header
    const downloadHeaderFile = () => {
        const headerData = [
            ["Dealer ID", "Dealer Group", "Model", "Vin No."] // ตัวอย่าง header ของไฟล์ Excel
        ];
        const ws = XLSX.utils.aoa_to_sheet(headerData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Header");
        XLSX.writeFile(wb, "header.xlsx"); // สร้างไฟล์ Excel ที่มี header นี้
    };

    // const excelUploadColumns = [
    //     { key: "Dealer ID", label: "Dealer ID" },
    //     { key: "Dealer Group", label: "Dealer Group" },
    //     { key: "Model", label: "Model" },
    //     { key: "Vin No.", label: "Vin No." }
    // ]


    const openAddModal = () => {
        setIsAddModalOpen(true);
    }

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        const payload = {
            lot: lot,
            data: excelData
        };

        fetchService.post('/api/dealer/stock/create', payload)
            .then(response => {
                if (response.status === 'success') {
                    alert('Stock created successfully');
                    setIsAddModalOpen(false);
                    loadData(lot);
                } else {
                    alert('Error: ' + response.message);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    }

    return (
        <div className="p-5">
          
            <h1 className="text-2xl font-bold mt-5 mb-2">Import</h1>
            <div className="mb-4">
                <Link onPress={downloadHeaderFile} aria-label="Download Header Excel">
                    Download Header Excel File
                </Link>
            </div>
            <div className="mb-4">
                <Input
                    aria-label="Upload Excel File"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                />
                {fileName && <p>Uploaded file: {fileName}</p>}
            </div>
            <div className="h-72 overflow-x-hidden overflow-y-auto">
                {excelData.length > 0 && (
                    // <CustomTable columns={excelUploadColumns} data={excelData} />
                    <>
                        <CustomTable
                            columns={excelUploadColumns}
                            data={excelData}
                            rowsPerPage={10}
                            renderFunction={renderFunction}
                            searchInColumn={"true"}
                            isShowNav={false}
                        />
                    </>

                )}
            </div>

            {/* <Breadcrumbs>
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem>Dealer</BreadcrumbItem>
                <BreadcrumbItem>Vin Stock</BreadcrumbItem>
            </Breadcrumbs> */}
            {/* <h1 className="text-2xl font-bold mt-5 mb-2">Vin Stock</h1>
            <Link aria-label="Add Vin Stock" onPress={openAddModal}>Add Vin Stock</Link>
            <div className="mt-5 mb-5">
                <div className="flex flex-col md:flex-row md:items-center space-y-5 md:space-x-5 md:space-y-0">
                    <div className="flex items-center">
                        <Input aria-label="Lot input" label="Lot" size="sm" type="number" value={lot} onValueChange={setLot} className="w-[85px]"/>
                    </div>
                    <div className="flex flex-row gap-3" aria-label="Button Group">
                    <Button
                        aria-label={isloading ? "Loading data" : "Get data"}
                        color="primary"
                        radius="md"
                        disabled={isloading}
                        onClick={handleGet}
                        startContent={isloading ? <CircularProgress size="sm" aria-label="Loading Icon" /> : null}
                    >
                        {isloading ? "Loading" : "Get"}
                    </Button>
                    </div>
                </div>
            </div>
            {data.length > 0 ? (
            <div>
                <CustomTable columns={columns} data={data} rowsPerPage={10} renderFunction={renderFunction} searchInColumn={"true"}/>
            </div>
            ) : (
                <div aria-live="polite">ไม่พบข้อมูล</div>
            )} */}

        </div>
    );
}