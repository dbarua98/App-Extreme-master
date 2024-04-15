import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Drawer from 'devextreme-react/drawer';
import { Toolbar, Item } from "devextreme-react/toolbar";
import NavigationList from './NavigationList';

const Navigation = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const token = localStorage.getItem("token");
  const [isOpened, setState] = useState(true);
  const buttonOptions = useMemo(() => {
      return {
          icon: "menu",
          onClick: () => {
              setState(!isOpened);
              console.log("clicked")
          }
      };
  }, [isOpened]);

  useEffect(() => {
    if (token) {
      setIsToken(true);
    } else {
      setIsToken(false);
    }
  }, [token]);

  // const handleToLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsToken(false);
  //   navigate("/");
  // };

  // const drawerContent = (
  //   <ul className="nav flex-column">
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/home">
  //         Home
  //       </NavLink>
  //     </li>
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/item">
  //         Items
  //       </NavLink>
  //     </li>
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/appointment">
  //         Appointments
  //       </NavLink>
  //     </li>
      
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/receipt">
  //         Receipts
  //       </NavLink>
  //     </li>
     
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/specialty">
  //         Specialties
  //       </NavLink>
  //     </li>
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/doctor">
  //         Doctors
  //       </NavLink>
  //     </li>
  //     <li className="nav-item">
  //       <NavLink className="nav-link" activeClassName="active" to="/" onClick={handleToLogout}>
  //         Logout 
  //       </NavLink>
  //     </li>
  //   </ul>
  // );

  return (
    <div>
      {isToken && <div>
      <Toolbar id="toolbar" width={40}>
                <Item 
                    widget="dxButton" 
                    options={buttonOptions} 
                    location="before" />
            </Toolbar>
      <Drawer
      opened={isOpened} 
      // minSize={30}
      // height={100v}
      revealMode="slide"
      // render={()=>drawerContent}
      render={NavigationList}

    >
    </Drawer>
    </div> }
      
    </div>
    
  );
};

export default Navigation;
