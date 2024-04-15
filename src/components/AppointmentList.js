
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import AppointmentModal from './AppointmentModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import moment from 'moment';
import DataGrid, { Column, Button as GridButton, Scrolling, Editing, Grouping, GroupPanel, Sorting, FilterRow, HeaderFilter, Selection, MasterDetail } from 'devextreme-react/data-grid';

const AppointmentList = ({ darkMode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [filterCity, setFilterCity] = useState([]);
    const [cityList, setCityList] = useState([]);
    // const [doctorsList, setDoctorsList] = useState([]);
    // const [specialtiesList, setSpecialtiesList] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    const initialData = {
        appointmentID: 0,
        appointmentDateTime: moment().toDate(),
        firstName: "",
        lastName: "",
        fullName: "",
        dob: tenYearsAgo,
        gender: null,
        mobileNo: "",
        maritalStatus: null,
        address: "",
        stateID: null,
        cityID: null,
        reasonForAppointment: "",
        specialityID: null,
        doctorID: null
    }
    const [patientAppointment, setPatientAppointment] = useState(initialData)
    const initialErrors = {
        appointmentDateTime: false,
        firstName: false,
        lastName: false,
        fullName: false,
        dob: false,
        gender: false,
        mobileNo: false,
        maritalStatus: false,
        address: false,
        stateID: false,
        cityID: false,
        reasonForAppointment: false,
        specialityID: false,
        doctorID: false
    }
    const [patientAppointmentError, setPatientAppointmentError] = useState(initialErrors)
    const [mobileValid, setMobileValid] = useState(false)
    const deleteMessage = "Are you sure you want to delete this Appointment?"
    const [value, setValue] = useState(new Date(1981, 3, 27));
    // const [filterDoctor,setFilterDoctor] = useState([]);



    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        debugger
        let filteredCities = cityList.filter(city => city.StateID === parseInt(patientAppointment.stateID));
        setFilterCity(filteredCities)
    }, [patientAppointment.stateID])




    // useEffect(()=>{
    //     let filterDoctor = doctorsList.filter(doctor => doctor.SpecialityID === parseInt(patientAppointment.specialityID));
    //     setFilterDoctor(filterDoctor)
    // },[patientAppointment.specialityID])

    // const fetchDoctorList = async () => {
    //     try {
    //         const response = await axios.get('https://localhost:7137/api/Doctor/GetLookupList', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         const doctorList = response.data;
    //         setDoctorsList(doctorList)
    //         console.log('Doctor list:', doctorList);
    //     } catch (error) {
    //         console.error('Error fetching doctor list:', error.message);
    //     }
    // }

    // const fetchSpecialtyList = async () => {
    //     try {
    //         const response = await axios.get('https://localhost:7137/api/Speciality/GetLookupList', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         const specialities = response.data;
    //         setSpecialtiesList(specialities)
    //         console.log('Speciality list:', specialities);
    //     } catch (error) {
    //         console.error('Error fetching speciality list:', error.message);
    //     }
    // }

    const fetchPatientList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Patient/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const patientList = response.data;
            setAppointments(patientList)
            console.log('Patient list:', patientList);
        } catch (error) {
            console.error('Error fetching patient list:', error.message);
        }
    }

    const fetchStateList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/State/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const stateList = response.data;
            setStateList(stateList)
            console.log('State list:', stateList);
        } catch (error) {
            console.error('Error fetching state list:', error.message);
        }
    }

    const fetchCityList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/City/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cityList = response.data;
            setCityList(cityList)
            console.log('City list:', cityList);
        } catch (error) {
            console.error('Error fetching city list:', error.message);
        }
    }

    useEffect(() => {
        fetchPatientList()
        // fetchDoctorList()
        // fetchSpecialtyList()
        fetchStateList()
        fetchCityList()

    }, [])

    const handleCloseModal = () => {
        setPatientAppointment(initialData)
        setIsModalOpen(false);
        setSelectedAppointment(null);
        setPatientAppointmentError(initialErrors)
        setMobileValid(false)
    };

    const handleAddClick = () => {
        setSelectedAppointment(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const validateAppointment = () => {
        debugger;
        let hasError = false;
        const newErrors = {};
        for (const key in patientAppointment) {
            if (key !== 'appointmentID' && !patientAppointment[key] && patientAppointment[key] !== 0) {
                newErrors[key] = true;
                hasError = true;
            } else if (key === 'mobileNo' && patientAppointment[key].length < 10) {
                setMobileValid(true);
                hasError = true;
            } else {
                newErrors[key] = false;
            }
        }
        setPatientAppointmentError(newErrors);
        return hasError;
    };


    const handleSaveAppointment = async () => {
        debugger
        if (validateAppointment()) {
            return;
        }
        debugger
        if (selectedAppointment) {
            const selectedDateTime = new Date(patientAppointment.appointmentDateTime);
            // Get the timezone offset in minutes
            const timezoneOffset = selectedDateTime.getTimezoneOffset();
            // Adjust the date and time by subtracting the timezone offset
            selectedDateTime.setMinutes(selectedDateTime.getMinutes() - timezoneOffset);
            // Convert the adjusted date and time to ISO 8601 format
            const isoDateTime = selectedDateTime.toISOString();
            console.log("updateData", patientAppointment)
            const updatedPatientData = {
                "appointmentID": patientAppointment.appointmentID,
                "appointmentDateTime": isoDateTime,
                "firstName": patientAppointment.firstName,
                "lastName": patientAppointment.lastName,
                "fullName": patientAppointment.fullName,
                "dob": patientAppointment.dob,
                "gender": parseInt(patientAppointment.gender),
                "mobileNo": (patientAppointment.mobileNo).toString,
                "maritalStatus": parseInt(patientAppointment.maritalStatus),
                "address": patientAppointment.address,
                "stateID": parseInt(patientAppointment.stateID),
                "cityID": parseInt(patientAppointment.cityID),
                "reasonForAppointment": patientAppointment.reasonForAppointment,
                "specialityID": parseInt(patientAppointment.specialityID),
                "doctorID": parseInt(patientAppointment.doctorID)
            }
            try {
                const response = await axios.put(`https://localhost:7137/api/Patient/Update/`, updatedPatientData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Patient updated successfully:');
                fetchPatientList();
                setPatientAppointment(initialData)
                setPatientAppointmentError(initialErrors)
            } catch (error) {
                console.error('Error updating patient:', error.message);
            }
        } else {
            console.log("first", patientAppointment)
            const selectedDateTime = new Date(patientAppointment.appointmentDateTime);
            // Get the timezone offset in minutes
            const timezoneOffset = selectedDateTime.getTimezoneOffset();
            // Adjust the date and time by subtracting the timezone offset
            selectedDateTime.setMinutes(selectedDateTime.getMinutes() - timezoneOffset);
            // Convert the adjusted date and time to ISO 8601 format
            const isoDateTime = selectedDateTime.toISOString();
            const patientData = {
                "appointmentID": 0,
                "appointmentDateTime": isoDateTime,
                "firstName": patientAppointment.firstName,
                "lastName": patientAppointment.lastName,
                "fullName": patientAppointment.fullName,
                "dob": patientAppointment.dob,
                "gender": parseInt(patientAppointment.gender),
                "mobileNo": (patientAppointment.mobileNo).toString,
                "maritalStatus": parseInt(patientAppointment.maritalStatus),
                "address": patientAppointment.address,
                "stateID": parseInt(patientAppointment.stateID),
                "cityID": parseInt(patientAppointment.cityID),
                "reasonForAppointment": patientAppointment.reasonForAppointment,
                "specialityID": parseInt(patientAppointment.specialityID),
                "doctorID": parseInt(patientAppointment.doctorID)
            }
            try {
                const response = await axios.post('https://localhost:7137/api/Patient/Insert', patientData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = response.data;
                console.log('Patient inserted successfully:', data);
                setPatientAppointment(initialData)
                setPatientAppointmentError(initialErrors)
                fetchPatientList();
            } catch (error) {
                console.error('Error inserting patient:', error.message);
            }
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = async (appointmentId) => {
        setDeleteAppointmentId(appointmentId)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Patient/Delete/${deleteAppointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPatientList()
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };



   
    const handleChange = useCallback((name, value) => {
        //    console.log("handleChange",name,value)
        //    const { name, value } = e.target;
        setPatientAppointment(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);


    const handleDateChange = (value) => {
        setPatientAppointment({ ...patientAppointment, dob: value });
        setPatientAppointmentError({ ...patientAppointmentError, dob: false })
    };


    const onDateTimeValueChanged = useCallback((args) => {
        // setDateValue(args.value);
        // setPatientAppointment({ ...patientAppointment, appointmentDateTime: args.value })
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            appointmentDateTime: args.value
        }));
    }, []);
    const onDateValueChanged = useCallback((args) => {
        // setDateValue(args.value);
        // setPatientAppointment({ ...patientAppointment, dob: args.value })
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            dob: args.value
        }));
    }, []);

    const handleDoctorChange = (selectedOption) => {
        setPatientAppointment({ ...patientAppointment, doctorID: selectedOption.value });
        setPatientAppointmentError({ ...patientAppointmentError, doctorID: false })
    };

  

    const handleSpecialtyChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            specialityID: args.value
        }));
    }, []);

   

    const handleStateChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            stateID: args.value
        }));
    }, []);

    const handleGenderChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            gender: args.value
        }));
    }, []);
    const handleMaritalStatusChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            maritalStatus: args.value
        }));
    }, []);

 
    const handleCityChange = useCallback((args) => {
        setPatientAppointment((prevApp) => ({
            ...prevApp,
            cityID: args.value
        }));
    }, []);

    const customizeHeaderText = (options) => {
        if (options.value === 0) {
            return "Male";
        } else if (options.value === 1) {
            return "Female";
        }
        return options.value;
    };

    return (
        <div className="container" style={{ height: "100vh" }}>
            <div className="w-100 d-flex justify-content-between my-2">
                <h3>Appointment List</h3>
                <Button variant="primary" onClick={handleAddClick}>Add</Button>
            </div>
            <DataGrid
                dataSource={appointments}
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
                <Column dataField='FullName' caption='Full Name' />
                <Column dataField='Gender' caption='Gender' cellRender={data => data.value === 0 ? <td>Male</td> : <td>Female</td>}>
                    <HeaderFilter allowSelectAll={true} dataSource={[
                        { value: 0, text: 'Male' },
                        { value: 1, text: 'Female' }
                    ]} >
                        
                    </HeaderFilter>
                    
                </Column>
                <Column dataField='SpecialityName' caption='Speciality Name' />
                <Column dataField='DoctorName' caption='Doctor Name' />
                <Column type='buttons'>
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.AppointmentID)} />
                </Column>
            </DataGrid>

            {isModalOpen &&
                <AppointmentModal
                    show={isModalOpen}
                    handleClose={handleCloseModal}
                    handleSave={handleSaveAppointment}
                    selectedAppointment={selectedAppointment}
                    patientAppointment={patientAppointment}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    // handleDateTimeChange={handleDateTimeChange}
                    // doctorsList={doctorsList}
                    // doctorsList={filterDoctor}
                    handleDoctorChange={handleDoctorChange}
                    // specialtiesList={specialtiesList}
                    handleSpecialtyChange={handleSpecialtyChange}
                    stateList={stateList}
                    handleStateChange={handleStateChange}
                    // cityList={selectedAppointment ? cityList : filterCity}
                    cityList={filterCity}
                    handleCityChange={handleCityChange}
                    setPatientAppointment={setPatientAppointment}
                    patientAppointmentError={patientAppointmentError}
                    darkMode={darkMode}
                    mobileValid={mobileValid}
                    handleGenderChange={handleGenderChange}
                    handleMaritalStatusChange={handleMaritalStatusChange}
                    onDateTimeValueChanged={onDateTimeValueChanged}
                    //  appointments={appointments}
                    onDateValueChanged={onDateValueChanged}
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

export default AppointmentList;
