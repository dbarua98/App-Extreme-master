import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';

const tasks = [
    { ID: 1, Subject: 'Task 1', StartDate: '2024-04-09', DueDate: '2024-04-10', Priority: 'High', Status: 'Completed' },
    { ID: 2, Subject: 'Task 2', StartDate: '2024-04-10', DueDate: '2024-04-11', Priority: 'Medium', Status: 'In Progress' },
    // Add more tasks as needed
];

// const getTasks = (key) => tasks.filter(task => task.EmployeeID === key);
const getTasks = (key) => tasks.filter(task => task.ID === key);

const completedValue = (rowData) => rowData.Status === 'Completed';

const DetailTemplate = (props) => {
    
    console.log("props",props.data.data.DoctorName)
    const { DoctorName } = (props.data.data);
    // const dataSource = getTasks(props.data.DoctorID);
    const dataSource = getTasks(props.data.data.DoctorID);
    console.log("doctorName",DoctorName)

    return (
        <React.Fragment>
            <div className="master-detail-caption">{`${DoctorName}'s Tasks:`}</div>
            <DataGrid
                dataSource={dataSource}
                showBorders={true}
                columnAutoWidth={true}
            >
                <Column dataField="Subject" />
                <Column dataField="StartDate" dataType="date" />
                <Column dataField="DueDate" dataType="date" />
                <Column dataField="Priority" />
                <Column
                    caption="Completed"
                    dataType="boolean"
                    calculateCellValue={completedValue}
                />
            </DataGrid>
        </React.Fragment>
    );
};

export default DetailTemplate;
