
import "./MyComponent.scss"
import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { SelectBox } from 'devextreme-react/select-box';
import Validator, { RequiredRule,AsyncRule } from 'devextreme-react/validator';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import { Popup } from 'devextreme-react/popup';
import axios from 'axios';



const DoctorModal = ({ show, handleClose, handleSave, selectedDoctor, doctor, handleChange, setDoctor, specialtiesList, handleSpecialtyChange, darkMode, duplicateError }) => {
    const token = localStorage.getItem("token");
    useEffect(() => {
        debugger
        console.log("selectedDoctor", selectedDoctor)
        if (selectedDoctor) {
            setDoctor({
                ...doctor,
                DoctorName: selectedDoctor.DoctorName,
                SpecialityID: selectedDoctor.SpecialityID,
                Education: selectedDoctor.Education,
            })
        }
        console.log("doctor", doctor)
    }, [selectedDoctor]);

    const formattedSpecialtyOptions = specialtiesList.map(specialty => ({
        Name: specialty.SpecialityName,
        ID: specialty.SpecialityID
    }));

    console.log("formattedSpecialtyOptions", formattedSpecialtyOptions)
    console.log("first", doctor)

    async function sendRequest(value) {
        if(!selectedDoctor){
        try {
            const response = await axios.get(`https://localhost:7137/api/Doctor/CheckDuplicateDoctorName/${value}`, {
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
        
        if(selectedDoctor.DoctorName == value){
            return true
        }else{
            try {
                const response = await axios.get(`https://localhost:7137/api/Doctor/CheckDuplicateDoctorName/${value}`, {
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
        <div>
            {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton >
                <Modal.Title>{selectedDoctor ? 'Edit' : 'Add'} Doctor</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Form>
                    <Form.Group controlId="DoctorName">
                        <TextBox
                            name='DoctorName'
                            label="Doctor Name"
                            labelMode="floating"
                            placeholder="Enter Doctor Name"
                            value={doctor && doctor?.DoctorName}
                            // onValueChange={
                            //     handleChange
                            // }
                            onValueChange={(e) => handleChange("DoctorName", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Doctor Name is required" />
                            </Validator>
                        </TextBox>
                    </Form.Group>
                    <Form.Group controlId="SpecialityID">
                        <SelectBox
                            searchEnabled={true}
                            dataSource={formattedSpecialtyOptions}
                            displayExpr={"Name"}
                            valueExpr={"ID"}
                            value={
                                doctor.SpecialityID
                            }
                            onValueChanged={handleSpecialtyChange}
                            // elementAttr={selectBoxAttributes}
                            showDropDownButton={true}
                            label="Specialty"
                            labelMode="floating"
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Please Select the Specialty" />
                            </Validator>
                        </SelectBox>
                    </Form.Group>
                    <Form.Group controlId="education">
                        <TextBox
                            label="Education"
                            labelMode="floating"
                            placeholder="Enter Education"
                            value={doctor?.Education}
                            onValueChange={(e) => handleChange("Education", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Education is required" />
                            </Validator>
                        </TextBox>
                    </Form.Group>
                </Form>
                <p style={{ fontSize: "x-small", color: "red" }}>{duplicateError ? "Doctor Already Exists." : ""}</p>
            </Modal.Body>
            <Modal.Footer  >
                <Button onClick={handleClose}>Close</Button>
                <Button
                    text="Contained"
                    type="default"
                    stylingMode="contained"
                    useSubmitBehavior={true} onClick={handleSave}>{selectedDoctor ? 'Update' : 'Save'}</Button>
            </Modal.Footer>
        </Modal > */}
            <Popup
                visible={show}
                onHiding={handleClose}
                dragEnabled={false}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title={selectedDoctor ? 'Edit' : 'Add'}
                // container=".dx-viewport"
                width={500}
                height={280}
            >
                {/* <Position
          at="bottom"
          my="center"
          of={positionOf}
          collision="fit"
        /> */}
                {/* <ToolbarItem
          widget="dxButton"
          toolbar="top"
          locateInMenu="always"
          options={getInfoButtonOptions()}
        /> */}
                {/* <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="before"
          options={getEmailButtonOptions()}
        /> */}
                {/* <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getCloseButtonOptions()}
        /> */}
                {/* <p> */}
                {/* Full Name:&nbsp; */}
                {/* <span>{currentEmployee.FirstName}</span>&nbsp; */}
                {/* <span>{currentEmployee.LastName}</span> */}
                {/* </p> */}
                {/* <p>
          Birth Date: <span>{currentEmployee.BirthDate}</span>
        </p>
        <p>
          Address: <span>{currentEmployee.Address}</span>
        </p>
        <p>
          Hire Date: <span>{currentEmployee.HireDate}</span>
        </p>
        <p>
          Position: <span>{currentEmployee.Position}</span>
        </p> */}
                <Form>
                    <Form.Group controlId="DoctorName">
                        <TextBox
                            name='DoctorName'
                            label="Doctor Name"
                            labelMode="floating"
                            placeholder="Enter Doctor Name"
                            value={doctor?.DoctorName}
                            onValueChange={(e) => handleChange("DoctorName", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Doctor Name is required" />
                                <AsyncRule
                                    message="Item Already Exist"
                                    validationCallback={asyncValidation}
                                />
                            </Validator>
                        </TextBox>
                    </Form.Group>
                    <Form.Group controlId="SpecialityID">
                        <SelectBox
                            searchEnabled={true}
                            dataSource={formattedSpecialtyOptions}
                            displayExpr={"Name"}
                            valueExpr={"ID"}
                            value={
                                doctor.SpecialityID
                            }
                            onValueChanged={handleSpecialtyChange}
                            // elementAttr={selectBoxAttributes}
                            showDropDownButton={true}
                            label="Specialty"
                            labelMode="floating"
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Please Select the Specialty" />
                            </Validator>
                        </SelectBox>
                    </Form.Group>
                    <Form.Group controlId="education">
                        <TextBox
                            label="Education"
                            labelMode="floating"
                            placeholder="Enter Education"
                            value={doctor?.Education}
                            onValueChange={(e) => handleChange("Education", e)}
                            valueChangeEvent="input"
                            maxLength={20}
                            showClearButton={true}
                            validationMessagePosition="down"
                        >
                            <Validator>
                                <RequiredRule message="Education is required" />
                            </Validator>
                        </TextBox>
                    </Form.Group>
                </Form>
                <div className='d-flex justify-content-end gap-2 mt-4'>
                    <Button onClick={handleClose}>Close</Button>
                    <Button
                        text="Contained"
                        type="default"
                        stylingMode="contained"
                        useSubmitBehavior={true} onClick={handleSave}>{selectedDoctor ? 'Update' : 'Save'}</Button>
                </div>
            </Popup>
        </div>
    );
};

export default DoctorModal;
