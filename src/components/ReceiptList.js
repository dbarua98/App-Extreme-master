import React, { useCallback, useEffect, useState } from "react";
import { Button, Table, useAccordionButton } from "react-bootstrap";
import ReceiptModal from "./ReceiptModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import DataGrid, { Column, Button as GridButton, Scrolling, Editing, Grouping, GroupPanel, Sorting, FilterRow, HeaderFilter, Selection, MasterDetail } from 'devextreme-react/data-grid';

const ReceiptList = ({ darkMode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [deleteReceiptId, setDeleteReceiptId] = useState(null);

    const initialData = {
        receiptID: 0,
        receiptNo: `${new Date().getFullYear()}${Math.floor(
            Math.random() * 10000
        )}`,
        personName: "",
        receiptDate: new Date(),
        doctorID: 14,
        netAmount: 0,
        remarks: "",
        receiptDetail: [
            {
                receiptDetailID: 0,
                receiptID: 0,
                itemID: 0,
                quantity: "",
                rate: "",
                discount: 0,
                amount: 0,
                itemName: "",
                unit: "",
                grossAmount: 0,
                discountPercent: "",
            },
        ],
    }

    const [receiptData, setReceiptData] = useState(initialData);
    const initialErrors = {
        receiptNo: false,
        personName: false,
        receiptDate: false,
        remarks: false,
        receiptDetail: false
    }
    const [receiptError, setReceiptError] = useState(initialErrors)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const deleteMessage = "Are you sure you want to delete this Receipt?"

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const validateReceipt = () => {
        debugger
        let hasError = false;
        let hasDetailError = false;
        const newErrors = {};

        // Check for missing values in receiptData object
        for (const key in receiptData) {
            if (key !== 'receiptDetail' && key !== 'receiptID' && !receiptData[key]) {
                newErrors[key] = true;
                hasError = true;
            } else {
                newErrors[key] = false;
            }
        }

        // Check for missing values in receiptDetail array
        if (receiptData.receiptDetail) {
            receiptData.receiptDetail.forEach((detail, index) => {
                let detailError = false; // Flag to track if any error occurs in detail object
                for (const key in detail) {
                    if (key !== 'receiptDetailID' && key !== 'receiptID' && key !== 'discount' && key !== 'discountPercent' && key !== 'amount' && key !== 'itemName' && key !== 'grossAmount' && key !== 'unit' && !detail[key]) {
                        newErrors[`receiptDetail[${index}].${key}`] = true;
                        hasError = true;
                        detailError = true; // Set detailError to true if any error occurs in detail object
                    } else {
                        newErrors[`receiptDetail[${index}].${key}`] = false;
                    }
                }
                if (detailError) {
                    hasDetailError = true; // Set hasDetailError to true if any detail error occurs
                }
            });
            newErrors['receiptDetail'] = hasDetailError; // Set receiptDetail error based on hasDetailError
        }

        setReceiptError(newErrors);

        return hasError;
    };

    const fetchReceiptList = async () => {
        try {
            const response = await axios.get(
                "https://localhost:7137/api/Receipt/GetList",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const receiptList = response.data;
            setReceipts(receiptList);
            console.log("Receipt list:", receiptList);
        } catch (error) {
            console.error("Error fetching receipt list:", error.message);
        }
    };

    const fetchItemsList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Item/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const itemList = response.data;
            console.log('Item list:', itemList);
            setItemList(itemList)
        } catch (error) {
            console.error('Error fetching item list:', error.message);
        }
    }

    useEffect(() => {
        fetchReceiptList();
        fetchItemsList();
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReceipt(null);
        setReceiptData(initialData)
        setReceiptError(initialErrors)
    };

    const handleAddClick = () => {
        setSelectedReceipt(null);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        debugger;
        if (selectedReceipt) {
            if (validateReceipt()) {
                return;
            }
            const extractReceiptDetailItems = () => {
                const extractedItems = receiptData.receiptDetail.map((detail) => ({
                    receiptDetailID: detail.receiptDetailID,
                    receiptID: detail.receiptID,
                    itemID: detail.itemID,
                    quantity: parseInt(detail.quantity),
                    rate: parseInt(detail.rate),
                    discount: parseInt(detail.discountPercent),
                    amount: detail.amount,
                }));

                return extractedItems;
            };
            const extractedItems = extractReceiptDetailItems();
            const updatedReceiptData = {
                receiptID: selectedReceipt.receiptID,
                receiptNo: parseInt(receiptData.receiptNo),
                receiptDate: receiptData.receiptDate,
                doctorID: 14,
                netAmount: parseInt(receiptData.netAmount),
                remarks: receiptData.remarks,
                receiptDetail: extractedItems,
            };
            try {
                const response = await axios.put(
                    `https://localhost:7137/api/Receipt/Update/`,
                    updatedReceiptData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data;
                console.log("Receipt updated successfully:");
                setReceiptData(initialData)
                fetchReceiptList();
            } catch (error) {
                console.error("Error updating receipt:", error.message);
            }
        } else {
            if (validateReceipt()) {
                return;
            }
            const extractReceiptDetailItems = () => {
                const extractedItems = receiptData.receiptDetail.map((detail) => ({
                    receiptDetailID: detail.receiptDetailID,
                    receiptID: detail.receiptID,
                    itemID: detail.itemID,
                    quantity: parseInt(detail.quantity),
                    rate: parseInt(detail.rate),
                    discount: parseInt(detail.discountPercent),
                    amount: detail.amount,
                }));

                return extractedItems;
            };
            const extractedItems = extractReceiptDetailItems();

            const receiptAddData = {
                receiptID: 0,
                receiptNo: parseInt(receiptData.receiptNo),
                receiptDate: receiptData.receiptDate,
                doctorID: 14,
                netAmount: parseInt(receiptData.netAmount),
                remarks: receiptData.remarks,
                receiptDetail: extractedItems,
            };

            try {
                const response = await axios.post(
                    "https://localhost:7137/api/Receipt/Insert",
                    receiptAddData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data;
                console.log("Receipt inserted successfully:", data);
                setReceiptData(initialData)
                fetchReceiptList();
            } catch (error) {
                console.error("Error inserting receipt:", error.message);
                throw error;
            }
        }
        handleCloseModal();
    };

    const fetchReceiptById = async (receiptId) => {
        try {
            const response = await axios.get(
                `https://localhost:7137/api/Receipt/GetById/${receiptId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const receiptData = response.data;
            setSelectedReceipt({ ...receiptData, receiptID: receiptId });
            console.log("Receiptby id data:", receiptData);
        } catch (error) {
            console.error("Error fetching receipt data:", error.message);
        }
    };

    const handleEditClick = (receipt) => {
        console.log("id recdeipt", receipt.ReceiptID);
        fetchReceiptById(receipt.ReceiptID);

        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        setDeleteReceiptId(id)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Receipt/Delete/${deleteReceiptId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchReceiptList();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    const handleDateChange = (value) => {
        setReceiptData({ ...receiptData, receiptDate: value });
        setReceiptError({ ...receiptError, receiptDate: false })
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     setReceiptData((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    //     setReceiptError({
    //         ...receiptError, [name]: false
    //     })
    // };

    const handleChange = useCallback((name, value) => {
        //    console.log("handleChange",name,value)
        //    const { name, value } = e.target;
        setReceiptData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const formatReceiptDate = (receiptDate) => {
        const date = new Date(receiptDate);
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="container" style={{ height: "100vh" }}>
            <div className="w-100 d-flex justify-content-between my-2">
                <h3>Receipt List</h3>
                <Button variant="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </div>
            <DataGrid
                dataSource={receipts}
                showBorders={true}
                width="100%"
            // height={600}
            // remoteOperations={true}

            >
                <Scrolling mode='infinite' />
                <Editing mode='batch'
                    allowDeleting={true}
                    allowUpdating={true}
                />
                <GroupPanel visible={true} />
                <Sorting mode='multiple' />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <Column dataField='ReceiptNo' caption='Receipt No' />
                <Column dataField='ReceiptDate' caption='Receipt Date' />
                <Column dataField='NetAmount' caption='Net Amount' />
                <Column dataField='Remarks' caption='Remarks' />
                {/* <Column dataField='FullName' caption='Full Name' /> */}
                {/* <Column dataField='Gender' caption='Gender' cellRender={data => data.value === 0 ? <td>Male</td> : <td>Female</td>}>
                    <HeaderFilter allowSelectAll={true} dataSource={[
                        { value: 0, text: 'Male' },
                        { value: 1, text: 'Female' }
                    ]} >

                    </HeaderFilter>

                </Column> */}
                {/* <Column dataField='SpecialityName' caption='Speciality Name' />
                <Column dataField='DoctorName' caption='Doctor Name' /> */}
                <Column type='buttons'>
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.AppointmentID)} />
                </Column>
            </DataGrid>
{isModalOpen && 
    <ReceiptModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                selectedReceipt={selectedReceipt}
                receiptData={receiptData}
                setReceiptData={setReceiptData}
                handleDateChange={handleDateChange}
                handleChange={handleChange}
                itemList={itemList}
                receiptError={receiptError}
                setReceiptError={setReceiptError}
                darkMode={darkMode}
            />
}
            
            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
                darkMode={darkMode}
            />
        </div>
    );
};

export default ReceiptList;
