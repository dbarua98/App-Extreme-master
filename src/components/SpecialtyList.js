import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import SpecialtyModal from './SpecialtyModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DataGrid, { Column, Button as GridButton, Scrolling, Editing, Grouping, GroupPanel, Sorting, FilterRow, HeaderFilter, Selection, MasterDetail } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';

const SpecialtyList = ({ darkMode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const initialData = {
        SpecialityName: '',
        Description: ''
    }
    const [speciality, setSpeciality] = useState(initialData);
    const initialErrors = {
        SpecialityName: false,
        Description: false
    }
    const [specialtyError, setSpecialtyError] = useState(initialErrors)
    const [errors, setErrors] = useState({
        SpecialityName: false,
        Description: false
    })
    const [deleteSpecialtyId, setDeleteSpecialtyId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inUseError, setInUseError] = useState(false)
    const deleteMessage = "Are you sure you want to delete this Specialty?"
    const [duplicateError, setDuplicateError] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [autoExpandAll, setAutoExpandAll] = useState(true);
    // const [selectedEmployeeNames, setSelectedEmployeeNames] = useState('Nobody has been selected');
    // const [prefix, setPrefix] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const getSpecialityList = async () => {
        try {
            const response = await axios.get('https://localhost:7137/api/Speciality/GetList', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const specialities = response.data;
            setSpecialties(specialities)
            console.log('Speciality get list:', specialities);
        } catch (error) {
            console.error('Error fetching speciality list:', error.message);
        }
    }

    useEffect(() => {
        getSpecialityList();
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSpecialty(null);
        setSpecialtyError(initialErrors)
        setSpeciality(initialData)
        setDuplicateError(false)
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const validateSpecialty = () => {
        debugger
        let hasError = false;
        const newErrors = {};

        for (const key in speciality) {
            if (!speciality[key]) {
                newErrors[key] = true;
                hasError = true;
            } else {
                newErrors[key] = false;
            }
        }

        setSpecialtyError(newErrors);

        return hasError;
    };

    const handleSave = async () => {
        debugger
        if (validateSpecialty()) {
            return;
        }
        if (selectedSpecialty) {
            const updatedData = {

                specialityID: selectedSpecialty?.SpecialityID,
                specialityName: speciality?.SpecialityName,
                isGynac: false,
                description: speciality?.Description

            }
            try {
                const response = await axios.put(`https://localhost:7137/api/Speciality/Update/`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                getSpecialityList();
                console.log('Speciality updated successfully:');
                handleCloseModal();
            } catch (error) {
                console.error('Error updating speciality:', error.message);
                if (error.response.data.includes("Cannot accept duplicate speciality name.")) {
                    setDuplicateError(true);
                }
            }
        } else {
            try {
                // Add new Specialty
                const data = {
                    "specialityName": speciality.SpecialityName,
                    "description": speciality.Description
                }
                const response = await axios.post('https://localhost:7137/api/Speciality/Insert', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const resData = response.data;
                getSpecialityList();
                console.log('Speciality inserted successfully:', resData);
                handleCloseModal();
            } catch (error) {
                console.error('Error inserting speciality:', error.message);
                if (error.response.data.includes("Cannot accept duplicate speciality name.")) {
                    setDuplicateError(true);
                }
            }
        }

    };

    const handleEditClick = (specialt) => {
        setSelectedSpecialty(specialt);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        setDeleteSpecialtyId(id)
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`https://localhost:7137/api/Speciality/Delete/${deleteSpecialtyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getSpecialityList();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting item:', error.response.data);
            if (error.response.data.includes("Selected record exists in Doctors.")) {
                setInUseError(true)
            }

        }
    };

    const handleChange = useCallback((name, value) => {
        //    console.log("handleChange",name,value)
        //    const { name, value } = e.target;
        setSpeciality(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setInUseError(false)
    };

    const onSelectionChanged = useCallback(
        ({ selectedRowKeys: changedRowKeys }) => {
            console.log("onSelected", changedRowKeys)
            //   setPrefix(null);
            setSelectedRowKeys(changedRowKeys);
            //   setSelectedEmployeeNames(getEmployeeNames(selectedRowsData));
        }, [],
    );

    const renderDetail = (props) => {
        const { Description } = props.data;
        return (
            <div>
                <p >{Description}</p>
            </div>
        );
    };


    console.log("specialtyInput", speciality)

    async function sendBatchRequest(url, changes) {
        debugger
        console.log("chnages", changes[0].data, url)
        const updatedSpecialtyData = {
            ...changes[0].key, ...changes[0].data
        }
        const finalData = {
            specialityID: updatedSpecialtyData?.SpecialityID,
            specialityName: updatedSpecialtyData?.SpecialityName,
            isGynac: false,
            description: updatedSpecialtyData?.Description
        }
        try {
            const response = await axios.put(`${url}`, finalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            getSpecialityList();
        } catch (error) {
            console.error('Error updating doctor:', error.message);
            // if (error.response.data.includes("Cannot accept duplicate doctor name")) {
            //     setDuplicateError(true);
            // }
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
            e.promise = processBatchRequest(`${"https://localhost:7137/api/Speciality/Update/"}`, e.changes, e.component);
        }
    };
    const onAutoExpandAllChanged = useCallback(() => {
        setAutoExpandAll((previousAutoExpandAll) => !previousAutoExpandAll);
    }, []);




    return (
        <div className="container " style={{ height: "100vh" }}>
            <div className="w-100 d-flex justify-content-between my-2">
                <h3>Specialty List</h3>
                <Button variant="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </div>
            <DataGrid
                dataSource={specialties}
                selectedRowKeys={selectedRowKeys}
                onSelectionChanged={onSelectionChanged}
                onSaving={onSaving}
            >
                <Scrolling mode='infinite' />
                <Editing mode='batch'
                    allowDeleting={true}
                    allowUpdating={true}
                />
                <Selection
                    // showCheckBoxesMode='false'
                    mode="multiple" />
                <GroupPanel visible={true} />
                <Sorting mode='single' />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} allowSearch="true" />
                <MasterDetail
                    autoExpandAll={autoExpandAll}
                    enabled={true}
                    render={renderDetail}
                />
                <Column dataField='SpecialityName' caption='Speciality Name' >

                </Column>
                <Column type='buttons'
                >
                    <GridButton text='Edit' icon='edit' onClick={(row) => handleEditClick(row.row.data)} />
                    <GridButton text='Delete' icon='trash' onClick={(row) => handleDeleteClick(row.row.data.SpecialityID)} />
                </Column>
            </DataGrid>
            <span className="caption">Selected Records:</span> <span>{selectedRowKeys.length ? (selectedRowKeys.map((selectedRow) => selectedRow.SpecialityName).join(',')) : "No Record Selected"}</span>
            <div>
                <CheckBox
                    text="Expand All"
                    id="autoExpand"
                    value={autoExpandAll}
                    onValueChanged={onAutoExpandAllChanged}
                />
            </div>

            {isModalOpen && <SpecialtyModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                handleChange={handleChange}
                speciality={speciality}
                selectedSpecialty={selectedSpecialty}
                errors={errors}
                setErrors={setErrors}
                setSpeciality={setSpeciality}
                specialtyError={specialtyError}
                duplicateError={duplicateError}
                darkMode={darkMode}
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

export default SpecialtyList;