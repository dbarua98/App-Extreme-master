import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Select from "react-select";
import moment from 'moment';
import axios from "axios"
import { Popup } from 'devextreme-react/popup';
import TextBox from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { NumberBox } from 'devextreme-react/number-box';
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
} from 'devextreme-react/validator';
import DateBox from 'devextreme-react/date-box';

const AppointmentModal = ({ show, handleClose, handleSave, selectedAppointment, handleChange, patientAppointment, handleDateChange, handleDoctorChange, handleSpecialtyChange, stateList, handleStateChange, cityList, handleCityChange, setPatientAppointment, patientAppointmentError, darkMode, mobileValid, handleGenderChange, handleMaritalStatusChange, onDateTimeValueChanged, onDateValueChanged }) => {
    const token = localStorage.getItem("token");
    const [specialtiesList, setSpecialtiesList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [filterDoctor, setFilterDoctor] = useState([]);
    const dateTimeLabel = { 'aria-label': 'Date Time' };
    const now = new Date();
    const [value, setValue] = useState(new Date(1981, 3, 27));

    const fetchSpecialtyList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Speciality/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const specialities = response.data;
            setSpecialtiesList(specialities)
            console.log('Speciality list:', specialities);
        } catch (error) {
            console.error('Error fetching speciality list:', error.message);
        }
    }

    const fetchDoctorList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Doctor/GetLookupList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const doctorList = response.data;
            setDoctorsList(doctorList)
            console.log('Doctor list:', doctorList);
        } catch (error) {
            console.error('Error fetching doctor list:', error.message);
        }
    }

    useEffect(() => {
        fetchSpecialtyList();
        fetchDoctorList();
    }, [])

    useEffect(() => {
        let filterDoctor = doctorsList.filter(doctor => doctor.SpecialityID === parseInt(patientAppointment.specialityID));
        setFilterDoctor(filterDoctor)
    }, [patientAppointment.specialityID,doctorsList])

    useEffect(() => {
        if (selectedAppointment) {
            setPatientAppointment({
                ...patientAppointment,
                appointmentID: selectedAppointment.AppointmentID,
                appointmentDateTime: selectedAppointment.AppointmentDateTime,
                firstName: selectedAppointment.FirstName,
                lastName: selectedAppointment.LastName,
                fullName: selectedAppointment.FullName,
                dob: selectedAppointment.DOB,
                gender: selectedAppointment.Gender,
                mobileNo: selectedAppointment.MobileNo,
                maritalStatus: selectedAppointment.MaritalStatus,
                address: selectedAppointment.Address,
                stateID: selectedAppointment.StateID,
                cityID: selectedAppointment.CityID,
                reasonForAppointment: selectedAppointment.ReasonForAppointment,
                specialityID: selectedAppointment.SpecialityID,
                doctorID: selectedAppointment.DoctorID
            })
        }


    }, [selectedAppointment, patientAppointment.appointmentID]);
    console.log("last", patientAppointment)

    const formattedDoctorOptions = filterDoctor.map(doctor => ({
        Name: doctor.DoctorName,
        ID: doctor.DoctorID
    }));

    const formattedSpecialtyOptions = specialtiesList.map(specialty => ({
        Name: specialty.SpecialityName,
        ID: specialty.SpecialityID
    }));

    const formattedStateOptions = stateList.map(state => ({
        Name: state.StateName,
        ID: state.StateID
    }));

    const formattedCityOptions = cityList.map(city => ({
        Name: city.CityName,
        ID: city.CityID
    }));

    const genderOptions = [
        { ID: 0, Name: 'Male' },
        { ID: 1, Name: 'Female' },
        { ID: 2, Name: 'Others' }
    ]
    const maritalStatusOptions = [
        { ID: 0, Name: 'Married' },
        { ID: 1, Name: 'UnMarried' },
    ]
    const inputStyle = darkMode ? darkModeStyle : lightModeStyle;

    const customStyles = {
        control: provided => ({
            ...provided,
            backgroundColor: darkMode ? 'bg-dark' : 'bg-light', // Change background color based on darkMode

        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? (darkMode ? '#333' : '#007bff') : (darkMode ? '#000' : '#fff'),
            color: state.isSelected ? '#fff' : (darkMode ? '#fff' : '#000'),
        }),
        singleValue: provided => ({
            ...provided,
            color: darkMode ? '#fff' : '#000', // Change text color of the selected value based on darkMode
        }),
    };

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 10);

    const onValueChanged = useCallback((e) => {
        console.log("dateandTimeChange", e)
        setValue(e.value);
    }, []);


    const [dateValue, setDateValue] = useState(new Date());

    // const dateBoxAttributes = useMemo(() => ({
    //     id: 'elementId',
    //     class: 'class-name'
    // }), []);

    // const onDateTimeValueChanged = useCallback((args) => {
    //     // setDateValue(args.value);
    //     setPatientAppointment({ ...patientAppointment, appointmentDateTime: args.value })
    // }, []);

    const min = new Date(1900, 0, 1);
    const max = new Date();



    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    console.log("dateValue", patientAppointment)
    return (
        // <Modal show={show} onHide={handleClose} size="lg">
        //     <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
        //         <Modal.Title>{selectedAppointment ? 'Edit' : 'Add'} Appointment</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //         <Form>
        //             <div >
        //                 <Form.Group controlId="appointmentDateTime"  >
        //                     <Form.Label>Appointment Date and Time</Form.Label>
        //                     <Datetime
        //                         value={moment(patientAppointment.appointmentDateTime)}
        //                         onChange={handleDateTimeChange}
        //                         inputProps={{ placeholder: 'Please select Date and Time', style: inputStyle }}
        //                         className={'bg-light  text-dark'}
        //                     />
        //                     <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.appointmentDateTime ? "Please select Appointment Date & Time" : ""}</p>
        //                 </Form.Group>
        //             </div>
        //             <div >
        //                 <div className='d-flex gap-3'>
        //                     <Form.Group controlId="firstName" className='w-25'>
        //                         <Form.Label>First Name</Form.Label>
        //                         <Form.Control
        //                             type="text"
        //                             value={patientAppointment.firstName}
        //                             onChange={handleChange}
        //                             name='firstName'
        //                             className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.firstName ? "Please Enter First Name" : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="lastName" className='w-25'>
        //                         <Form.Label>Last Name</Form.Label>
        //                         <Form.Control
        //                             type="text"
        //                             value={patientAppointment.lastName}
        //                             onChange={handleChange}
        //                             name='lastName'
        //                             className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.lastName ? "Please Enter Last Name" : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="fullName" className='w-50'>
        //                         <Form.Label>Full Name</Form.Label>
        //                         <Form.Control
        //                             type="text"
        //                             value={patientAppointment.fullName}
        //                             onChange={handleChange}
        //                             name='fullName'
        //                             className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.fullName ? "Please Enter Full Name" : ""}</p>
        //                     </Form.Group>
        //                 </div>
        //                 <div className='d-flex gap-3'>
        //                     <Form.Group controlId="dob" className='d-flex flex-column w-25'>
        //                         <Form.Label>Date of Birth</Form.Label>
        //                         <DatePicker className={`rounded border w-100 p-2 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
        //                             selected={patientAppointment.dob}
        //                             onChange={handleDateChange}
        //                             dateFormat="yyyy-MM-dd"
        //                             maxDate={minDate}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.dob ? "Please Enter DOB" : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="gender" className='ms-auto w-25' >
        //                         <Form.Label>Gender</Form.Label>
        //                         {/* <Form.Control as="select" value={patientAppointment.gender} onChange={handleChange} name='gender'  className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //                             <option value="">Select Gender</option>
        //                             <option value={0}>Male</option>
        //                             <option value={1}>Female</option>
        //                             <option value={2}>Others</option>

        //                         </Form.Control> */}
        //                         <Select
        //                             options={genderOptions}
        //                             value={
        //                                 genderOptions &&
        //                                 genderOptions.find(
        //                                     option => option.value === (patientAppointment.gender)
        //                                 )
        //                             }
        //                             onChange={handleGenderChange}
        //                             styles={customStyles}

        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.gender ? "Please Select Gender " : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="mobileNo" className='ms-auto w-25' >
        //                         <Form.Label>Mobile No.</Form.Label>
        //                         <Form.Control
        //                             type="number"
        //                             value={patientAppointment.mobileNo}
        //                             onChange={handleChange}
        //                             name='mobileNo'
        //                             className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                         />
        //                         {(patientAppointmentError.mobileNo) ? (<p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.mobileNo ? "Please Enter Mobile Number" : ""}</p>) :
        //                             (<p style={{ fontSize: "x-small", color: "red" }}>{mobileValid ? "Please Enter 10 digit" : ""}</p>)}

        //                     </Form.Group>
        //                     <Form.Group controlId="maritalStatus" className='ms-auto w-25'>
        //                         <Form.Label>Marital Status</Form.Label>
        //                         {/* <Form.Control as="select" value={patientAppointment.maritalStatus} onChange={handleChange} name='maritalStatus' className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
        //                             <option value="">Select Status</option>
        //                             <option value={0}>Married</option>
        //                             <option value={1}>UnMarried</option>
        //                         </Form.Control> */}
        //                         <Select
        //                             options={maritalStatusOptions}
        //                             value={
        //                                 maritalStatusOptions &&
        //                                 maritalStatusOptions.find(
        //                                     option => option.value === (patientAppointment.maritalStatus)
        //                                 )
        //                             }
        //                             onChange={handleMaritalStatusChange}
        //                             styles={customStyles}

        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.maritalStatus ? "Please Select Marital Status" : ""}</p>
        //                     </Form.Group>
        //                 </div>
        //                 <div className='d-flex justify-content-between gap-3'>
        //                     <Form.Group controlId="address" className='w-50' >
        //                         <Form.Label>Address</Form.Label>
        //                         <Form.Control
        //                             type="text"
        //                             value={patientAppointment.address}
        //                             onChange={handleChange}
        //                             name='address'
        //                             className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.address ? "Please Enter Address" : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="stateID" className='w-25'>
        //                         <Form.Label>State</Form.Label>
        //                         <Select

        //                             options={formattedStateOptions}
        //                             value={
        //                                 formattedStateOptions &&
        //                                 formattedStateOptions.find(
        //                                     option => option.value === (patientAppointment.stateID)
        //                                 )
        //                             }
        //                             onChange={handleStateChange}
        //                             styles={customStyles}

        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.stateID ? "Please Select State" : ""}</p>
        //                     </Form.Group>
        //                     <Form.Group controlId="cityID" className='w-25'>
        //                         <Form.Label>City</Form.Label>
        //                         <Select
        //                             options={formattedCityOptions}
        //                             value={
        //                                 formattedCityOptions &&
        //                                 formattedCityOptions.find(
        //                                     option => option.value === (patientAppointment.cityID)
        //                                 )
        //                             }
        //                             onChange={handleCityChange}
        //                             styles={customStyles}
        //                         />
        //                         <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.cityID ? "Please Select City" : ""}</p>
        //                     </Form.Group>

        //                 </div>
        //             </div>
        //             <div>
        //                 <Form.Group controlId="reasonForAppointment">
        //                     <Form.Label>Reason For Appointment</Form.Label>
        //                     <Form.Control
        //                         type="text"
        //                         value={patientAppointment.reasonForAppointment}
        //                         onChange={handleChange}
        //                         name='reasonForAppointment'
        //                         className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
        //                     />
        //                     <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.reasonForAppointment ? "Please Enter Reason For Appointment" : ""}</p>
        //                 </Form.Group>
        //             </div>
        //             <div className='d-flex justify-content-between gap-3'>
        //                 <Form.Group controlId="specialityID" className='w-50'>
        //                     <Form.Label>Specialty</Form.Label>
        //                     <Select
        //                         options={formattedSpecialtyOptions}
        //                         value={
        //                             formattedSpecialtyOptions &&
        //                             formattedSpecialtyOptions.find(
        //                                 option => option.value === (patientAppointment.specialityID)
        //                             )
        //                         }
        //                         onChange={handleSpecialtyChange}
        //                         styles={customStyles}
        //                     />
        //                     <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.specialityID ? "Please Select Specialty" : ""}</p>
        //                 </Form.Group>
        //                 <Form.Group controlId="doctorID" className='w-50 '>
        //                     <Form.Label>Doctor Name</Form.Label>
        //                     <Select
        //                         options={formattedDoctorOptions}
        //                         value={
        //                             formattedDoctorOptions &&
        //                             formattedDoctorOptions.find(
        //                                 option => option.value === (patientAppointment.doctorID)
        //                             )
        //                         }
        //                         onChange={handleDoctorChange}
        //                         styles={customStyles}
        //                     />
        //                     <p style={{ fontSize: "x-small", color: "red" }}>{patientAppointmentError.doctorID ? "Please Select Doctor" : ""}</p>
        //                 </Form.Group>

        //             </div>
        //         </Form>
        //     </Modal.Body>
        //     <Modal.Footer className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
        //         <Button variant="secondary" onClick={handleClose}>Close</Button>
        //         <Button variant="primary" onClick={handleSave}>{selectedAppointment ? 'Update' : 'Save'}</Button>
        //     </Modal.Footer>
        // </Modal>
        <Popup
            visible={show}
            onHiding={handleClose}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={selectedAppointment ? 'Edit' : 'Add'}
            // container=".dx-viewport"
            width={400}
            height={500}
        >
            <DateBox
                type="datetime"
                defaultValue={now}
                value={patientAppointment.appointmentDateTime}
                min={min}
                // max={now}
                // elementAttr={dateBoxAttributes}
                maxLength={50}
                label="Date and Time"
                labelMode="floating"
                onValueChanged={onDateTimeValueChanged}
                validationMessagePosition="down"
                pickerType={"calendar"}
                // displayFormat={"shortdate"}
                useMaskBehavior={true}
            />

            <TextBox
                name='firstName'
                label='First Name'
                labelMode='floating'
                placeholder='Enter First Name'
                value={patientAppointment.firstName}
                onValueChange={(e) => handleChange("firstName", e)}
                valueChangeEvent='input'
                showClearButton={true}
                maxLength={20}
                validationMessagePosition='down'
            >
                <Validator>
                    <RequiredRule message='Please Enter First Name' />
                </Validator>
            </TextBox>

            <TextBox
                name='lastName'
                label='Last Name'
                labelMode='floating'
                placeholder='Enter Last Name'
                value={patientAppointment.lastName}
                onValueChange={(e) => handleChange("lastName", e)}
                valueChangeEvent='input'
                showClearButton={true}
                maxLength={20}
                validationMessagePosition='down'
            >
                <Validator>
                    <RequiredRule message='Please Enter Last Name' />
                </Validator>
            </TextBox>
            <TextBox
                name='fullName'
                label='Full Name'
                labelMode='floating'
                placeholder='Enter Full Name'
                value={patientAppointment.fullName}
                onValueChange={(e) => handleChange("fullName", e)}
                valueChangeEvent='input'
                showClearButton={true}
                maxLength={20}
                validationMessagePosition='down'
            >
                <Validator>
                    <RequiredRule message='Please Enter Full Name' />
                </Validator>
            </TextBox>

            <DateBox
                type="date"
                // defaultValue={tenYearsAgo}
                value={patientAppointment.dob}
                // min={tenYearsAgo}
                max={tenYearsAgo}
                // elementAttr={dateBoxAttributes}
                maxLength={50}
                label="DOB"
                labelMode="floating"
                onValueChanged={onDateValueChanged}
                validationMessagePosition="down"
                pickerType={"calendar"}
                // displayFormat={"shortdate"}
                useMaskBehavior={true}
            />

            <SelectBox
                searchEnabled={true}
                dataSource={genderOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.gender
                }
                onValueChanged={handleGenderChange}
                showDropDownButton={true}
                label="Gender"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the Gender" />
                </Validator>
            </SelectBox>

            <NumberBox
                name='mobileNo'
                mode="tel"
                min={0}
                step={0}
                // format={{ type:'decimal', precision:1}}
                value={patientAppointment.mobileNo}
                // elementAttr={numberBoxAttributes}
                maxLength={10}
                // minLength={10}
                valueChangeEvent='input'
                label='Mobile Number'
                labelMode='floating'
                onValueChange={(e) => handleChange("mobileNo", e)}
                validationMessagePosition='bottom'
            >
                <Validator>
                    <RequiredRule message="Mobile Number is Required" />
                </Validator>
            </NumberBox>

            <SelectBox
                searchEnabled={true}
                dataSource={maritalStatusOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.maritalStatus
                }
                onValueChanged={handleMaritalStatusChange}
                showDropDownButton={true}
                label="Marital Status"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the Marital Status" />
                </Validator>
            </SelectBox>

            <TextBox
                name='address'
                label='Address'
                labelMode='floating'
                placeholder='Enter Address'
                value={patientAppointment.address}
                onValueChange={(e) => handleChange("address", e)}
                valueChangeEvent='input'
                showClearButton={true}
                maxLength={20}
                validationMessagePosition='down'
            >
                <Validator>
                    <RequiredRule message='Please Enter Address' />
                </Validator>
            </TextBox>

            <SelectBox
                searchEnabled={true}
                dataSource={formattedStateOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.stateID
                }
                onValueChanged={handleStateChange}
                showDropDownButton={true}
                label="State"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the State" />
                </Validator>
            </SelectBox>

            <SelectBox
                searchEnabled={true}
                dataSource={formattedCityOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.cityID
                }
                onValueChanged={handleCityChange}
                showDropDownButton={true}
                label="City"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the City" />
                </Validator>
            </SelectBox>

            <TextBox
                name='reasonForAppointment'
                label='Reason For Appointment'
                labelMode='floating'
                placeholder='Reason For Appointment'
                value={patientAppointment.reasonForAppointment}
                onValueChange={(e) => handleChange("reasonForAppointment", e)}
                valueChangeEvent='input'
                showClearButton={true}
                maxLength={20}
                validationMessagePosition='down'
            >
                <Validator>
                    <RequiredRule message='Please Enter Reason For Appointment' />
                </Validator>
            </TextBox>

            <SelectBox
                searchEnabled={true}
                dataSource={formattedSpecialtyOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.specialityID
                }
                onValueChanged={handleSpecialtyChange}
                showDropDownButton={true}
                label="Speciality"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the Speciality" />
                </Validator>
            </SelectBox>
            <SelectBox
                searchEnabled={true}
                dataSource={formattedDoctorOptions}
                displayExpr={"Name"}
                valueExpr={"ID"}
                value={
                    patientAppointment.doctorID
                }
                onValueChanged={handleDoctorChange}
                showDropDownButton={true}
                label="Doctor"
                labelMode="floating"
                validationMessagePosition="down"
            >
                <Validator>
                    <RequiredRule message="Please Select the Doctor" />
                </Validator>
            </SelectBox>

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

        </Popup>
    );
};

export default AppointmentModal;



const darkModeStyle = {
    backgroundColor: '#212529',
    color: '#fff',
};

const lightModeStyle = {
    backgroundColor: '#fff',
    color: '#333',
};