import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ItemModal from './ItemModal';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DataGrid, { Column, Button as GridButton, Scrolling,Editing,Grouping,GroupPanel,Sorting,FilterRow,HeaderFilter} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';

const ItemList = ({ darkMode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemsList, setItemsList] = useState([]);
    const initialData = {
        itemName: ""
    }
    const [item, setItem] = useState(initialData);
    const initialError = {
        itemName: false
    }
    const [itemError, setItemError] = useState(initialError)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const deleteMessage = "Are you sure you want to delete this item?"
    const [duplicateError, setDuplicateError] = useState(false)
    const [inUseError, setInUseError] = useState(false)
    const [loadPanelVisible, setLoadPanelVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const getItemsList = async () => {
        setLoadPanelVisible(true)
        try {
            setTimeout(async()=>{
                const response = await axios.get('https://localhost:7137/api/Item/GetList', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data;
                setItemsList(data)
                setLoadPanelVisible(false)

            },500)
            

        } catch (error) {
            console.error('Error fetching data:', error.message);
            setLoadPanelVisible(false)
        }
    }

    useEffect(() => {
        getItemsList();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setItemError(initialData)
        setItem(initialData)
        setDuplicateError(false)
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const validateItem = () => {
        
        let hasError = false;
        const newErrors = {};

        for (const key in item) {
            if (!item[key]) {
                newErrors[key] = true;
                hasError = true;
            } else {
                newErrors[key] = false;
            }
        }

        setItemError(newErrors);

        return hasError;
    };

    const handleSave = async () => {
        
        if (validateItem()) {
            return;
        }
        if (selectedItem) {
            const updatedItemData = {
                itemID: selectedItem.ItemID,
                itemName: item.itemName
            };

            try {

                const response = await axios.put(`https://localhost:7137/api/Item/Update/`, updatedItemData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                handleCloseModal();
                getItemsList();
            } catch (error) {
                console.error('Error updating item:', error.message);
                if (error.response.data.includes("Cannot accept duplicate item name")) {
                    setDuplicateError(true);
                }
            }
        } else {
            // Add new item

            const newItem = { ItemName: item.itemName };
            try {

                const response = await axios.post('https://localhost:7137/api/Item/Insert', newItem, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Item inserted successfully', response);

                getItemsList();

                handleCloseModal();
            } catch (error) {
                console.error(error.response.data);
                if (error.response.data.includes("Cannot accept duplicate item name")) {
                    setDuplicateError(true);
                }

            }
        }

    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (itemId) => {
        setDeleteItemId(itemId)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {

        try {
            const response = await axios.delete(`https://localhost:7137/api/Item/Delete/${deleteItemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            getItemsList();
            setIsDeleteModalOpen(false);

        } catch (error) {
            console.error('Error deleting item:', error.message);
            if (error.response.data.includes("The statement has been terminated")) {
                setInUseError(true);
            }
        }

    };

    // const handleChange = (e) => {
    //     setDuplicateError(false)
    //     const { name, value } = e.target;
    //     setItem(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    //     setItemError({
    //         ...itemError, [name]: false
    //     })
    // };

    const handleChange = useCallback((name, args) => {
        // const { name, value } = args;
        console.log("args", name, args)
        setItem(prevState => ({
            ...prevState,
            [name]: args
        }));
        // setDoctor((prevDoctor) => ({
        //   ...prevDoctor,
        //   SpecialityID: args.value // Update SpecialityID with the new value from args
        // }));
    }, []);

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setInUseError(false)
    };
    console.log("itemList", itemsList)


    
    async function sendBatchRequest(url, changes) {
        debugger
        console.log("chnages", changes[0].data, url)
        const updatedItemData = {
            ...changes[0].key, ...changes[0].data
        }
        const finalData = {
            itemID: updatedItemData.ItemID,
            itemName: updatedItemData.ItemName
        };
        console.log("FinalDoctorData", finalData)
        try {
            const response = await axios.put(`${url}`, finalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            getItemsList();
        } catch (error) {
            console.error('Error updating doctor:', error.message);
        }
    }
    async function processBatchRequest(url, changes, component) {
        debugger
        console.log("promiseBatch", changes, component)
        await sendBatchRequest(url, changes);
        await component.refresh(true);
        component.cancelEditData();
    }
    const onSaving = (e) => {
        debugger
        console.log("eChanges", e)
        e.cancel = true;
        if (e.changes.length) {
            e.promise = processBatchRequest(`${"https://localhost:7137/api/Item/Update/"}`, e.changes, e.component);
        }
    };


    return (
        <div className="container" style={{ height: "100vh" }}>
            <div className="w-100 d-flex justify-content-between my-2">
                <h3>Item List</h3>
                <Button variant="primary" onClick={handleAddClick}>Add</Button>
            </div>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                // onHiding={hideLoadPanel}
                visible={loadPanelVisible}
            // hideOnOutsideClick={hideOnOutsideClick}
            />
            <DataGrid
                allowColumnReordering={true}
                dataSource={itemsList}
                showBorders={true}
                onSaving={onSaving}
            >
                <Scrolling mode="infinite" />
                <Editing
                    mode="batch"
                    // allowAdding={true}
                    allowDeleting={true}
                    allowUpdating={true}

                />
                {/* <Grouping autoExpandAll={autoExpandAll} /> */}
                <GroupPanel visible={true} /> {/* or "auto" */}
                <Sorting mode="single" />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <Column
                    dataField="ItemName"
                    caption="Item Name"
                    width={500}
                >
                </Column>
                <Column type='buttons'>
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.ItemID)} />
                </Column>
            </DataGrid>
            {/* <Table striped bordered hover variant={darkMode?"dark":"light"}>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Item Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsList.map((item, index) => (
                        <tr key={item.ItemID}>
                            <td>{index + 1}</td>
                            <td>{item.ItemName}</td>
                            <td className="d-flex">
                                <Button className="mx-2" variant="info" onClick={() => handleEditClick(item)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(item.ItemID)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table> */}
            {isModalOpen && <ItemModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                selectedItem={selectedItem}
                item={item}
                setItem={setItem}
                handleChange={handleChange}
                itemError={itemError}
                darkMode={darkMode}
                duplicateError={duplicateError}
            />}

            <DeleteConfirmationModal
                show={isDeleteModalOpen}
                handleClose={handleDeleteModalClose}
                handleDelete={handleDeleteConfirmed}
                deleteMessage={deleteMessage}
                darkMode={darkMode}
                inUseError={inUseError}
            />
        </div>
    );
};

export default ItemList;