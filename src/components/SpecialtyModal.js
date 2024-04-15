import React, { useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
import { Popup } from 'devextreme-react/popup';
import TextBox, { TextBoxTypes } from 'devextreme-react/text-box';
import axios from 'axios';
import { Button } from 'devextreme-react/button';
import {
    Validator,
    RequiredRule,
    CompareRule,
    EmailRule,
    PatternRule,
    StringLengthRule,
    RangeRule,
    AsyncRule,
    CustomRule,
} from 'devextreme-react/validator';


const SpecialtyModal = ({ show, handleClose, handleSave, selectedSpecialty, handleChange, speciality, setSpeciality, specialtyError, darkMode, duplicateError }) => {
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (selectedSpecialty) {
            setSpeciality({
                ...speciality,
                SpecialityName: selectedSpecialty.SpecialityName,
                Description: selectedSpecialty.Description
            })
        }
    }, [selectedSpecialty]);


    
    async function sendRequest(value) {
        if(!selectedSpecialty){
        try {
            const response = await axios.get(`https://localhost:7137/api/Speciality/CheckDuplicateSpecialityName/${value}`, {
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
        if(selectedSpecialty.SpecialityName == value){
            return true
        }else{
            try {
                const response = await axios.get(`https://localhost:7137/api/Speciality/CheckDuplicateSpecialityName/${value}`, {
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
        // <Modal show={show} onHide={handleClose}>
        //     <Modal.Header closeButton className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //         <Modal.Title>{selectedSpecialty ? 'Edit' : 'Add'} Specialty</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //         <Form>
        //             <Form.Group controlId="SpecialityName">
        //                 <Form.Label>Specialty Name</Form.Label>
        //                 <Form.Control
        //                     type="text"
        //                     value={speciality.SpecialityName}
        //                     onChange={handleChange}
        //                     name="SpecialityName"
        //                     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                 />
        //                   <p style={{ fontSize: "x-small", color: "red" }}>{specialtyError.SpecialityName ? "Please Enter Name" : ""}</p>
        //                   <p style={{ fontSize: "x-small", color: "red" }}>{duplicateError ? "This Item Already Exist" : ""}</p>
        //             </Form.Group>
        //             <Form.Group controlId="Description">
        //                 <Form.Label>Description</Form.Label>
        //                 <Form.Control
        //                     type="text"
        //                     value={speciality.Description}
        //                     onChange={handleChange}
        //                     name="Description"
        //                     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                 />
        //                 <p style={{ fontSize: "x-small", color: "red" }}>{specialtyError.Description ? "Please Enter Description" : ""}</p>
        //             </Form.Group>
        //         </Form>
        //     </Modal.Body>
        //     <Modal.Footer className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //         <Button variant="secondary" onClick={handleClose}>
        //             Close
        //         </Button>
        //         <Button variant="primary" onClick={handleSave}>
        //             Save
        //         </Button>
        //     </Modal.Footer>
        // </Modal>
        <Popup
            visible={show}
            onHiding={handleClose}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={selectedSpecialty ? 'Edit' : 'Add'}
            container=".dx-viewport"
            width={400}
            height={230}

        >
            <form>
                <TextBox
                    name='SpecialityName'
                    label='Speciality Name'
                    labelMode='floating'
                    placeholder='Enter Specialty Name'
                    value={speciality.SpecialityName}
                    onValueChange={(e) => handleChange("SpecialityName", e)}
                    valueChangeEvent="input"
                    showClearButton={true}
                    maxLength={20}
                    validationMessagePosition='down'
                >
                    <Validator>
                        <RequiredRule message='Please Enter Specialty Name' />
                        <AsyncRule
                            message="Specialty Already Exist"
                            validationCallback={asyncValidation}
                        />
                    </Validator>
                </TextBox>
                <TextBox
                    name='Description'
                    label='Description'
                    labelMode='floating'
                    placeholder='Enter Description'
                    value={speciality.Description}
                    onValueChange={(e) => handleChange("Description", e)}
                    valueChangeEvent='input'
                    showClearButton={true}
                    maxLength={20}
                    validationMessagePosition='down'
                >
                    <Validator>
                        <RequiredRule message='Please Enter Description' />
                    </Validator>
                </TextBox>
                <div className='d-flex justify-content-end gap-2 mt-3'>
                    <Button
                        width={70}
                        text="Cancel"
                        type="normal"
                        stylingMode="outlined"
                        onClick={handleClose}
                    />
                    <Button
                        useSubmitBehavior={true}
                        width={70}
                        text="Save"
                        type="default"
                        stylingMode="contained"
                        onClick={handleSave}
                    />
                </div>
            </form>
        </Popup>
    );
};

export default SpecialtyModal;