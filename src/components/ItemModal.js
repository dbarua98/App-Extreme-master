import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Popup } from 'devextreme-react/popup';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Validator, {
    RequiredRule, CustomRule, AsyncRule,
} from 'devextreme-react/validator';
import axios from "axios";

const ItemModal = ({ show, handleClose, handleSave, selectedItem, item, setItem, handleChange, itemError, darkMode, duplicateError }) => {
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (selectedItem) {
            setItem({ ...item, itemName: selectedItem.ItemName });
        }
    }, [selectedItem]);



    async function sendRequest(value) {
        if(!selectedItem){
        try {
            const response = await axios.get(`https://localhost:7137/api/Item/CheckDuplicateItemName/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status == 200){
                return true
            }else{
                return false;
            }
        } catch (error) {
            console.error('Error checking duplicate item name:', error);
            return false;
        }
    }else{
        if(selectedItem.ItemName == value){
            return true
        }else{
            try {
                const response = await axios.get(`https://localhost:7137/api/Item/CheckDuplicateItemName/${value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status == 200){
                    return true
                }else{
                    return false;
                }
            } catch (error) {
                console.error('Error checking duplicate item name:', error);
                return false;
            }
        }
    }
    }



    function asyncValidation(params) {
        debugger
        return sendRequest(params.value);
    }




    return (
        // <Modal show={show} onHide={handleClose} >
        //     <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
        //         <Modal.Title>{selectedItem ? 'Edit' : 'Add'} Item</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
        //         <Form>
        //             <Form.Group controlId="itemName">
        //                 <Form.Label>Item Name</Form.Label>
        //                 <Form.Control type="text" value={item.itemName} onChange={handleChange} name='itemName' className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}/>
        //                 <p style={{ fontSize: "x-small", color: "red" }}>{itemError.itemName ? "Please Enter Item Name" : ""}</p>
        //                 <p style={{ fontSize: "x-small", color: "red" }}>{duplicateError ? "This Item Already Exist" : ""}</p>
        //             </Form.Group>
        //         </Form>
        //     </Modal.Body>
        //     <Modal.Footer className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
        //         <Button variant="secondary" onClick={handleClose}>Close</Button>
        //         <Button variant="primary" onClick={handleSave}>{selectedItem ? 'Update' : 'Save'}</Button>
        //     </Modal.Footer>
        // </Modal>
        <Popup
            visible={show}
            onHiding={handleClose}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={selectedItem ? 'Edit' : 'Add'}
            container=".dx-viewport"
            width={300}
            height={200}
        >

            <Form>
                <Form.Group controlId="itemName">
                    {/* <Form.Label>Item Name</Form.Label> */}
                    <TextBox
                        name='itemName'
                        label='Item Name'
                        labelMode='floating'
                        placeholder='Enter Item Name'
                        value={item.itemName}
                        onValueChange={(e) => handleChange("itemName", e)}
                        valueChangeEvent='input'
                        maxLength={20}
                        showClearButton={true}
                        validationMessagePosition='down'
                    >

                        <Validator>
                            <RequiredRule message='Item Name is Required' />
                            {/* <CustomRule
                            
                                message="Both start and end dates must be selected"
                                validationCallback={validateItemDuplicate}
                            /> */}
                            <AsyncRule
                                message="Item Already Exist"
                                validationCallback={asyncValidation}
                            />
                        </Validator>



                    </TextBox>
                    {/* <Form.Control type="text" value={item.itemName} onChange={handleChange} name='itemName' className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} /> */}
                    {/* <p style={{ fontSize: "x-small", color: "red" }}>{itemError.itemName ? "Please Enter Item Name" : ""}</p> */}

                    {/* <p style={{ fontSize: "x-small", color: "red" }}>{duplicateError ? "This Item Already Exist" : ""}</p> */}
                </Form.Group>
            </Form>
            <div className='d-flex justify-content-end mt-3 gap-2'>
                <Button onClick={handleClose}>Close</Button>
                <Button
                    text="Contained"
                    type="default"
                    stylingMode="contained"
                    useSubmitBehavior={true} onClick={handleSave}>{selectedItem ? 'Update' : 'Save'}</Button>
            </div>
        </Popup>
    );
};

export default ItemModal;
