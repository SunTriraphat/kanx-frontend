import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Link
} from "@nextui-org/react";
import axios from "axios";
import Swal from 'sweetalert2';
import Navbar from "./navBar/Navbar";
import * as XLSX from "xlsx";
import ImportComponent from "./Import"
import CustomModal from "./CustomModal";

export default function CustomTable({ columns, data, renderFunction, rowsPerPage = 5, searchInColumn = false, defaultColumn = columns[0].key, topContent, isAdd, isImport, isUpdateDealer }) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(defaultColumn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [detailData, setDetailData] = useState();
  const [loadingModal, setLoadingModal] = useState(false);

  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    setPages(Math.ceil(data.length / rowsPerPage))
  }, []);


  const filteredData = useMemo(() => {
    if (!searchQuery) {
      setPages(Math.ceil(data.length / rowsPerPage))
      return data;
    }

    const searchResults = searchInColumn
      ? data.filter(item =>
        item[selectedColumn]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
      : data.filter(item =>
        columns.some(column =>
          item[column.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    // Remove duplicates based on a unique identifier (e.g., item id or vin_no)
    const uniqueResults = Array.from(new Set(searchResults.map(item => item.vin_no)))
      .map(uniqueVinNo => searchResults.find(item => item.vin_no === uniqueVinNo));
    setPage(1)
    setPages(Math.ceil(uniqueResults.length / rowsPerPage))
    return uniqueResults;
  }, [searchQuery, selectedColumn, data, searchInColumn, columns]);

  // Slice data ให้ตรงกับหน้าปัจจุบัน
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData, rowsPerPage]);

  const updateDealerCode = async () => {
    console.log('updateDealerCode');
    try {
      const response = await fetch(`${API_URL}update_dealer_code_data1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
    } catch (error) {

    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openImportModal = () => {
    setIsImportModalOpen(true);
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
  };

  const handleSubmit = async (e) => {
    await setLoadingModal(true)
    e.preventDefault();

    // Collect form data using FormData API
    const form = e.target;
    const formData = new FormData(form);

    // Convert FormData to JSON
    const formJSON = Object.fromEntries(formData.entries());
    console.log('JSON.stringify(formJSON)', JSON.stringify(formJSON));


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
          const response = await axios.post(
            `${API_URL}/auth/register`,
            formJSON,
          );
          console.log('response', response);


          if (response.status === 200) {
            form.reset(); // Reset the form after successful submission
            // setIsLoading(true)

            Swal.fire({
              title: 'Success',
              // text: 'The form has been submitted successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            await setIsModalOpen(false);
            window.location.reload();
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetailData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const CHUNK_SIZE = 500; // Adjust this value as needed

  const handleImport = async (e) => {

    const totalRecords = excelData.length;
    setLoadingModal(true);
    try {
      // Function to process data in chunks
      const sendInChunks = async () => {
        for (let i = 0; i < totalRecords; i += CHUNK_SIZE) {
          const chunk = excelData.slice(i, i + CHUNK_SIZE);
          const response = await fetch(`${API_URL}import_info_form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(chunk),
          });

          if (!response.ok) {
            throw new Error('Error sending chunk');
          }
        }
      };

      await sendInChunks();

      Swal.fire({
        title: 'Success',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Failed',
        text: 'There was an issue with the submission. Please try again',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setIsModalOpen(false);
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div>


      <p className="ml-5 mt-5 text-lg">{topContent}</p>



      {/* Search and Column Select */}

      <div className="flex items-center justify-between">
        <div className="ml-5 mt-5 flex items-center mb-4 w-1/4 space-x-4">
          {/* <p className="ml-5 text-lg">{topContent}</p> */}
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            endContent={
              searchInColumn && (
                <div className="flex items-center ml-4">
                  <label className="sr-only" htmlFor="column">Search</label>
                  <select
                    id="column"
                    name="column"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                  >
                    {columns.map((column) => (
                      <option key={column.key} value={column.key}>{column.label}</option>
                    ))}
                  </select>
                </div>
              )
            }
          />
        </div>
        {isAdd == true ?
          <div className="relative flex items-center gap-2 ml-auto mr-7">
            <Button size="sm" onClick={() => openModal()} color="primary">Add</Button>
          </div>
          : null}
        {isUpdateDealer == true ?
          <div className="relative flex items-center gap-2 ml-auto mr-7">
            <Button size="sm" onClick={() => updateDealerCode()} color="warning">Update Dealer Code</Button>
          </div>
          : null}
        {isImport == true ?
          <div className="relative flex items-center gap-2 ml-auto mr-7">
            <Button size="sm" onClick={() => openImportModal()} color="primary">Import</Button>
          </div>
          : null}

      </div>
      {isModalOpen && (
        <>
          <CustomModal isOpen={isModalOpen} onClose={closeModal}
            size="sm"
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
                      <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)} disabled={loadingModal}>
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
            <form id="modalForm" onSubmit={handleSubmit}>
              {columns.map((column) => (
                column.key !== 'actions' ? (
                  column.key !== 'password' ? (
                    <Input
                      key={column.key}
                      label={column.label}
                      type="text"
                      id={column.key}
                      name={column.key}
                      onChange={handleChange}
                      className="mb-4"
                    />
                  ) : (
                    <Input
                      key={column.key}
                      label={column.label}
                      type="password"
                      id={column.key}
                      name={column.key}
                      onChange={handleChange}
                      className="mb-4"
                    />
                  )
                ) : null // Skip rendering for 'action' key
              ))}
            </form>

          </CustomModal>
        </>

        // <Modal isOpen={isModalOpen} size={"md"} hideCloseButton={true} onClose={closeModal}>
        //   <ModalContent>
        //     {(onClose) => (
        //       <>
        //         <ModalHeader className="flex flex-col gap-1">เพิ่มผู้ใช้งาน</ModalHeader>
        //         <ModalBody>
        //           <form id="modalForm" onSubmit={handleSubmit}>
        //             {columns.map((column) => (
        //               column.key !== 'actions' ? (
        //                 column.key !== 'salt' ? (
        //                   <Input
        //                     key={column.key}
        //                     label={column.label}
        //                     type="text"
        //                     id={column.key}
        //                     name={column.key}
        //                     onChange={handleChange}
        //                     className="mb-4"
        //                   />
        //                 ) : (
        //                   <Input
        //                     key={column.key}
        //                     label={column.label}
        //                     type="password"
        //                     id={column.key}
        //                     name={column.key}
        //                     onChange={handleChange}
        //                     className="mb-4"
        //                   />
        //                 )
        //               ) : null // Skip rendering for 'action' key
        //             ))}
        //           </form>

        //         </ModalBody>
        //         <ModalFooter>
        //           {
        //             loadingModal ? (
        //               <Button isLoading color="primary">
        //                 Loading
        //               </Button>
        //             ) :
        //               <>
        //                 <Button color="danger" variant="light" onPress={onClose} disabled={loadingModal}>
        //                   Close
        //                 </Button>
        //                 <Button color="primary" type="submit" form="modalForm" disabled={loadingModal}>
        //                   Submit
        //                 </Button>
        //               </>

        //           }
        //         </ModalFooter>
        //       </>
        //     )}
        //   </ModalContent>
        // </Modal>
      )}
      {isImport === true && isImport != null && (
        <CustomModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          size="lg"
          color="gray-100"
          footer={
            <div className="flex justify-end">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleImport}>
                Submit
              </button>
            </div>
          }
        >
          <div className="overflow-y-auto overflow-x-auto max-h-[70vh]">
            <ImportComponent onValueSend={(val) => setExcelData(val)} />
          </div>
        </CustomModal>
      )}
      {/* {isImportModalOpen && (
        <Modal isOpen={isImportModalOpen} size={"5xl"} hideCloseButton={true} onClose={closeImportModal}>
          <ModalContent>
            {(onClose) => (
              <>
                <ImportComponent
                  onValueSend={(val) => setExcelData(val)}
                />
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
                        <Button color="primary" onClick={handleImport} disabled={loadingModal}>
                          Submit
                        </Button>
                      </>

                  }
                </ModalFooter>


              </>
            )}
          </ModalContent>
        </Modal>
      )} */}
      <Table
        isCompact
        aria-label="Custom table with pagination"

      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.align || "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (

            <TableRow key={item.vin_no}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderFunction(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="ml-5 flex justify-between items-center mt-4">
        <span className="text-small text-default-400">
          Showing {paginatedData.length} of {filteredData.length} items
        </span>
        <Pagination
          isCompact
          total={pages}
          page={page}
          onChange={setPage}
          showControls
          color="default"
        />
      </div>

    </div>
  );
}