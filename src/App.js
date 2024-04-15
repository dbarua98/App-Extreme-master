import 'devextreme/dist/css/dx.light.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Navigation from './components/Navigation';
import Home from './components/Home';
import DoctorList from './components/DoctorList';
import SpecialtyList from './components/SpecialtyList';
import ItemList from './components/ItemList';
import AppointmentList from './components/AppointmentList';
import ReceiptList from './components/ReceiptList';
// import { useState } from 'react';
// import { Button } from 'react-bootstrap';


function App() {
  

  return (
    <div className='d-flex' >
        <BrowserRouter>
        <div>
          <Navigation />
          </div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/doctor" element={<DoctorList/>} />
            <Route path="/item" element={<ItemList/>} />
            <Route path="/specialty" element={<SpecialtyList />} />
            <Route path="/appointment" element={<AppointmentList/>} />
            
            <Route path="/receipt" element={<ReceiptList />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

// import React, { useCallback, useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { Drawer } from 'devextreme-react';
// import NavigationList from './components/NavigationList';
// import Home from './components/Home';
// import DoctorList from './components/DoctorList';

// function App() {
//     const [state, setState] = useState(false);

//     const renderList = useCallback(() => {
//         const stateHandler = (newState) => setState(newState);
//         return <NavigationList stateHandler={stateHandler} />;
//     }, []);

//     return (
//         <div className='d-flex'>
//              <Drawer 
//                 render={renderList}>
//                 <div id="view">
//                     <Routes>
//                         <Route exact path="/home" element={<Home />} />
//                         <Route path="/doctor" element={<DoctorList />} />
//                         {/* <Route path="views/spam" element={<Spam />} />
//                         <Route path="views/trash" element={<Trash />} /> */}
//                     </Routes>
//                 </div>
//             </Drawer>
//         </div>
//     );
// }

// export default App;
