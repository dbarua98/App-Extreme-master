import React, { useCallback } from "react";
import List from "devextreme-react/list";
import { Link, useNavigate ,NavLink} from "react-router-dom";
import { Button } from "devextreme-react";
 
const navigation = [
    { id: 1, text: "Home", icon: "user", path: "home" },
    { id: 2, text: "Doctors", icon: "datapie", path: "doctor" },    
    { id: 3, text: "Appointments", icon: "columnfield", path: "appointment" },
    { id: 4, text: "Items", icon: "check", path: "item" },
    { id: 5, text: "Specialty", icon: "columnchooser", path: "specialty" },
    { id: 5, text: "Receipt", icon: "columnchooser", path: "receipt" },
];
 
function NavigationList(props){
    const navigate = useNavigate();
    const closeDrawer = () => {
        // props.setState(false);
    }

    const handleToLogout = () => {
        console.log("clicked")
        localStorage.removeItem("token");
        // // setIsToken(false);
        navigate("/");
      };
 
    const renderItem = useCallback((data) => {
        return (
            
            <div>
                <NavLink to={'/' + data.path} className="navLink">
                    <div>
                        <div className="dx-list-item-icon-container">
                            <i className={`dx-icon dx-list-item-icon dx-icon-${data.icon}`}/>
                        </div>
                        <span>{data.text}</span>
                    </div>
                </NavLink>
            </div>
               
        );
    }, []);
 
    return (
        <div>
            <List
                items={navigation}
                width={200}
                selectionMode="single"
                onSelectionChanged={closeDrawer}
                itemRender={renderItem}
            />
            <Button onClick={handleToLogout} >Logout</Button>
        </div>
    );
 
}
 
export default NavigationList;