import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
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
} from "devextreme-react/validator";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import DateBox from "devextreme-react/date-box";
import { SelectBox } from "devextreme-react/select-box";

const ReceiptModal = ({
  show,
  handleClose,
  handleSave,
  selectedReceipt,
  receiptData,
  handleDateChange,
  handleChange,
  setReceiptData,
  itemList,
  receiptError,
  setReceiptError,
  darkMode,
  
}) => {
  const formattedItemOptions = itemList.map((item) => ({
    Name: item.ItemName,
    ID: item.ItemID,
  }));

  const dataDetail = selectedReceipt?.ReceiptDetail.map((item) => {
    return {
      receiptDetailID: item.ReceiptDetailID,
      receiptID: item.ReceiptID,
      itemID: item.ItemID,
      quantity: item.Quantity,
      rate: item.Rate,
      discount: item.Discount,
      discountPercent: item.Discount,
      amount: item.Amount,
      itemName: "",
      unit: "",
      grossAmount: 0,
    };
  });

  useEffect(() => {
    debugger;
    console.log("object", selectedReceipt);
    if (selectedReceipt) {
      setReceiptData({
        ...receiptData,
        receiptNo: selectedReceipt.ReceiptNo,
        personName: "",
        receiptDate: selectedReceipt.ReceiptDate,
        doctorID: selectedReceipt.DoctorID,
        netAmount: selectedReceipt.NetAmount,
        remarks: selectedReceipt.Remarks,
        receiptDetail: dataDetail,
      });
    }
    console.log("received", receiptData.receiptDetail);
  }, [selectedReceipt]);

  const handleAddRow = () => {
    setReceiptData((prevState) => ({
      ...prevState,
      receiptDetail: [
        ...prevState.receiptDetail,
        {
          receiptDetailID: 0,
          receiptID: 0,
          itemID: 0,
          quantity: 0,
          rate: 0,
          discount: 0,
          amount: 0,
          itemName: "",
          unit: "",
          grossAmount: null,
          discountPercent: null,
        },
      ],
    }));
  };

  // Calculate gross amount
  const calculateGrossAmount = (item) => {
    return item.quantity * item.rate;
  };

  // Calculate discount amount
  const calculateDiscountAmount = (item) => {
    console.log("calculated value", item);
    return (item.quantity * item.rate * item.discountPercent) / 100;
  };

  // Calculate total amount
  const calculateAmount = (item) => {
    const grossAmount = calculateGrossAmount(item);
    const discountAmount = calculateDiscountAmount(item);
    const amnt = grossAmount - discountAmount;
    item["amount"] = amnt;
    return grossAmount - discountAmount;
  };
  const totalAmount = receiptData.receiptDetail.reduce(
    (total, detail) => total + detail.amount,
    0
  );
  useEffect(() => {
    setReceiptData({
      ...receiptData,
      netAmount: totalAmount,
    });
  }, [totalAmount]);

  const totalQuantity = receiptData.receiptDetail.reduce(
    (total, detail) => total + parseInt(detail.quantity),
    0
  );

  // const handleItemChange = (selectedItem, index, item) => {
  //     console.log("selectedItem", selectedItem);
  //     const updatedItems = [...receiptData.receiptDetail];
  //     updatedItems[index].itemID = selectedItem.value;
  //     setReceiptData({
  //         ...receiptData,
  //         receiptDetail: updatedItems,
  //     });
  //     item["itemID"] = selectedItem.value;
  //     setReceiptError({ ...receiptError, receiptDetail: false })
  // };
//   const handleItemChange = (e, index, item) => {
//     console.log("selectedItem", e.value, index, item);
//     const updatedItems = [...receiptData.receiptDetail];
//     updatedItems[index].itemID = e.value;
//     setReceiptData({
//       ...receiptData,
//       receiptDetail: updatedItems,
//     });
//     item["itemID"] = e.value;
//   };

const handleItemChange = (name, index, e) => {
    console.log("nameChange", name);
    console.log("changedValue", e);
    console.log("Index", index);
    
    setReceiptData(prevState => {
        const updatedItems = [...prevState.receiptDetail];
        updatedItems[index]["itemID"] = name.value;
        return {
            ...prevState,
            receiptDetail: updatedItems
        };
    });
};

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? "bg-dark" : "bg-light", // Change background color based on darkMode
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? darkMode
          ? "#333"
          : "#007bff"
        : darkMode
        ? "#000"
        : "#fff",
      color: state.isSelected ? "#fff" : darkMode ? "#fff" : "#000",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: darkMode ? "#fff" : "#000", // Change text color of the selected value based on darkMode
    }),
  };

  const now = new Date();

  const [value, setValue] = useState(new Date(1981, 3, 27));

  const onValueChanged = useCallback((e) => {
    setValue(e.value);
  }, []);

  const handleValueChange = useCallback((name,index, e) => {
    console.log("nameCahnge",name)
    console.log("changedValue",index)
    console.log("Index",e)
    setReceiptData(prevState => {
        const updatedItems = [...prevState.receiptDetail];
        updatedItems[index][`${name}`] = e;
        return {
            ...prevState,
            receiptDetail: updatedItems
        };
    });
},[]);
console.log("this is Selevceted",receiptData)
  return (
    // <Modal show={show} onHide={handleClose} size="lg">
    //     <Modal.Header closeButton className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
    //         <Modal.Title>Receipt</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}>
    //         <Form>
    //             <Form.Group controlId="receiptNo">
    //                 <Form.Label>Receipt No</Form.Label>
    //                 <Form.Control
    //                     type="text"
    //                     readOnly
    //                     value={receiptData.receiptNo}
    //                     name="receiptNo"
    //                     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    //                 />
    //             </Form.Group>
    //             <Form.Group controlId="formReceiptDate" >
    //                 <Form.Label>Receipt Date</Form.Label>
    //                 <DatePicker className={`mt-3 rounded border mx-2 ${darkMode?"bg-dark text-light":"bg-light text-dark"}`}
    //                     selected={receiptData.receiptDate}
    //                     onChange={handleDateChange}
    //                     dateFormat="yyyy-MM-dd"
    //                 />
    //                 <p style={{ fontSize: "x-small", color: "red" }}>{receiptError.receiptDate ? "Please Select Date" : ""}</p>

    //             </Form.Group>
    //             <Form.Group controlId="personName">
    //                 <Form.Label>Person Name</Form.Label>
    //                 <Form.Control
    //                     type="text"
    //                     value={receiptData.personName}
    //                     onChange={handleChange}
    //                     name="personName"
    //                     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    //                 />
    //                 <p style={{ fontSize: "x-small", color: "red" }}>{receiptError.personName ? "Please Enter Person Name" : ""}</p>

    //             </Form.Group>
    //             <Form.Group controlId="formItems" >
    //                 <Form.Label>Items</Form.Label>
    // {receiptData.receiptDetail.map((item, index) => (
    //     <div key={index} className="d-flex gap-1">
    //         <Col className="col-2">
    //             <Form.Group controlId="itemName">
    //                 <Select
    //                     options={formattedItemOptions}
    //                     value={
    //                         formattedItemOptions &&
    //                         formattedItemOptions.find(
    //                             option => option.value === (item.itemID)
    //                         )
    //                     }
    //                     onChange={(selectedItem) => handleItemChange(selectedItem, index, item)}
    //                     styles={customStyles}
    //                 />
    //             </Form.Group>
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="text"
    //                 placeholder="Unit"
    //                 value={item.unit}
    //                 onChange={(e) => {
    //                     const updatedItems = [...receiptData.receiptDetail];
    //                     updatedItems[index].unit = e.target.value;
    //                     setReceiptData({
    //                         ...receiptData,
    //                         receiptDetail: updatedItems,
    //                     });
    //                     setReceiptError({...receiptError,receiptDetail:false})
    //                 }}
    //                 name="unit"
    //                 className={`form-control ${darkMode ? 'placeholder-dark' : 'placeholder-light'} ${darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}`}
    //             />
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="text"
    //                 placeholder="rate"
    //                 value={item.rate}
    // onChange={(e) => {
    //     const updatedItems = [...receiptData.receiptDetail];
    //     updatedItems[index].rate = e.target.value;
    //     setReceiptData({
    //         ...receiptData,
    //         receiptDetail: updatedItems,
    //     });
    //     setReceiptError({...receiptError,receiptDetail:false})
    // }}
    //                 name="rate"
    //                 className={`form-control ${darkMode ? 'placeholder-dark' : 'placeholder-light'} ${darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}`}
    //             />
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="text"
    //                 placeholder="quantity"
    //                 value={item.quantity}
    // onChange={(e) => {
    //     const updatedItems = [...receiptData.receiptDetail];
    //     updatedItems[index].quantity = e.target.value;
    //     setReceiptData({
    //         ...receiptData,
    //         receiptDetail: updatedItems,
    //     });
    //     setReceiptError({...receiptError,receiptDetail:false})
    // }}
    //                 name="quantity"
    //                 className={`form-control ${darkMode ? 'placeholder-dark' : 'placeholder-light'} ${darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}`}
    //             />
    //         </Col>
    //         <Col>
    //             <Col>
    //                 <Form.Control
    //                     type="number"
    //                     placeholder="Gross Amount"
    //                     value={calculateGrossAmount(item)}
    //                     disabled
    //                     name="grossAmount"
    //                     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    //                 />
    //             </Col>
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="text"
    //                 placeholder="Discount %"
    //                 value={item.discountPercent}
    // onChange={(e) => {
    //     const updatedItems = [...receiptData.receiptDetail];
    //     updatedItems[index].discountPercent = e.target.value;
    //     setReceiptData({
    //         ...receiptData,
    //         receiptDetail: updatedItems,
    //     });
    //     setReceiptError({...receiptError,receiptDetail:false})
    // }}
    //                 name="discountPercent"
    //                 className={`form-control ${darkMode ? 'placeholder-dark' : 'placeholder-light'} ${darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}`}
    //             />
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="number"
    //                 placeholder="Discount Amount"
    //                 value={calculateDiscountAmount(item)}
    //                 disabled
    //                 name="discount"
    //                 className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    //             />
    //         </Col>
    //         <Col>
    //             <Form.Control
    //                 type="number"
    //                 placeholder="Amount"
    //                 value={calculateAmount(item)}
    //                 disabled
    //                 name="amount"
    //                 className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    //             />
    //         </Col>
    //     </div>
    // ))}
    //                         <p style={{ fontSize: "x-small", color: "red" }}>{receiptError.receiptDetail ? "Please Provide Item Details" : ""}</p>

    // <Button variant="primary" onClick={handleAddRow}>
    //     Add Item
    // </Button>
    //             </Form.Group>
    //             <Form.Group controlId="formTotalQty">
    //                 <Form.Label>Total Qty</Form.Label>

    // <Form.Control type="number" value={totalQuantity} disabled    className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'} />
    //             </Form.Group>
    //             <Form.Group controlId="formNetAmount">
    //                 <Form.Label>Net Amount</Form.Label>
    // <Form.Control
    //     type="number"
    //     value={receiptData.netAmount}
    //     disabled
    //     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    // />
    //             </Form.Group>
    //             <Form.Group controlId="remarks">
    //                 <Form.Label>Remarks</Form.Label>
    // <Form.Control
    //     type="text"
    //     value={receiptData.remarks}
    //     onChange={handleChange}
    //     name="remarks"
    //     className={darkMode ? 'bg-dark text-light ' : 'bg-light  text-dark'}
    // />
    //                 <p style={{ fontSize: "x-small", color: "red" }}>{receiptError.remarks ? "Please Enter Remark" : ""}</p>

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
      title={selectedReceipt ? "Edit" : "Add"}
      container=".dx-viewport"
      width={850}
      height={520}
    >
      <form>
        <TextBox
          name="receiptNo"
          label="Receipt No"
          labelMode="floating"
          value={receiptData.receiptNo}
          readOnly={true}
        ></TextBox>

        {/* <DateBox
                    type="date"
                    // defaultValue={tenYearsAgo}
                    value={receiptData.receiptDate}
                    // min={tenYearsAgo}
                    // max={tenYearsAgo}
                    // elementAttr={dateBoxAttributes}
                    maxLength={50}
                    label="DOB"
                    labelMode="floating"
                    // onValueChanged={onDateValueChanged}
                    validationMessagePosition="down"
                    pickerType={"calendar"}
                // displayFormat={"shortdate"}
                // useMaskBehavior={true}
                /> */}
        <DatePicker
          className={`mt-3 rounded border mx-2 ${
            darkMode ? "bg-dark text-light" : "bg-light text-dark"
          }`}
          selected={receiptData.receiptDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
        <TextBox
          name="personName"
          label="Person Name"
          labelMode="floating"
          placeholder="Enter Person Name"
          value={receiptData.personName}
          onValueChange={(e) => handleChange("personName", e)}
          valueChangeEvent="input"
          showClearButton={true}
          maxLength={20}
          validationMessagePosition="down"
        >
          <Validator>
            <RequiredRule message="Please Enter Person Name" />
          </Validator>
        </TextBox>

        {receiptData.receiptDetail.map((item, index) => (
          <div key={index} className="d-flex gap-1">
            <Col className="col-2">
              <Form.Group controlId="itemName">
                <SelectBox
                  searchEnabled={true}
                  dataSource={formattedItemOptions}
                  displayExpr={"Name"}
                  valueExpr={"ID"}
                  value={item.itemID}
                  onValueChanged={(e) => handleItemChange(e, index, item)}
                  showDropDownButton={true}
                  label="ItemName"
                  labelMode="floating"
                  validationMessagePosition="down"
                >
                  <Validator>
                    <RequiredRule message="Please Select the Item" />
                  </Validator>
                </SelectBox>
              </Form.Group>
            </Col>
            <Col>
              <TextBox
                name="unit"
                label="Unit"
                labelMode="floating"
                placeholder="Unit"
                value={item.unit}
                valueChangeEvent="input"
                showClearButton={true}
                maxLength={20}
                validationMessagePosition="down"
                onValueChange={(e) => {handleValueChange("unit",index,e)  }}
                    
                //   const updatedItems = [...receiptData.receiptDetail];
                //   updatedItems[index].unit = e;
                //   setReceiptData({
                //     ...receiptData,
                //     receiptDetail: updatedItems,
                //   });
              
                // onValueChange={(e) => handleValueChange(e)}
              >
                <Validator>
                  <RequiredRule message="Please Enter Unit" />
                </Validator>
              </TextBox>
            </Col>
            <Col>
              <TextBox
                name="rate"
                label="Rate"
                labelMode="floating"
                placeholder="Rate"
                value={item.rate}
                valueChangeEvent="input"
                showClearButton={true}
                maxLength={20}
                validationMessagePosition="down"
                // onValueChange={(e) => {
                //   const updatedItems = [...receiptData.receiptDetail];
                //   updatedItems[index].rate = e;
                //   setReceiptData({
                //     ...receiptData,
                //     receiptDetail: updatedItems,
                //   });
                // }}
                onValueChange={(e) => {handleValueChange("rate",index,e)}}
              >
                <Validator>
                  <RequiredRule message="Please Enter Rate" />
                </Validator>
              </TextBox>
            </Col>
            <Col>
              <TextBox
                name="quantity"
                label="Quantity"
                labelMode="floating"
                placeholder="Quantity"
                value={item.quantity}
                valueChangeEvent="input"
                showClearButton={true}
                maxLength={20}
                validationMessagePosition="down"
                onValueChange={(e) => {
                  const updatedItems = [...receiptData.receiptDetail];
                  updatedItems[index].quantity = e;
                  setReceiptData({
                    ...receiptData,
                    receiptDetail: updatedItems,
                  });
                }}
              >
                <Validator>
                  <RequiredRule message="Please Enter Quantity" />
                </Validator>
              </TextBox>
            </Col>
            <Col>
              <Col>
                <TextBox
                  name="unit"
                  label="Gross Amount"
                  labelMode="floating"
                  placeholder="Gross Amount"
                  value={calculateGrossAmount(item)}
                  maxLength={20}
                  validationMessagePosition="down"
                  readOnly={true}
                ></TextBox>
              </Col>
            </Col>
            <Col>
              <TextBox
                name="discountPercent"
                label="Discount Percent"
                labelMode="floating"
                placeholder="Discount Percent"
                value={item.discountPercent}
                valueChangeEvent="input"
                showClearButton={true}
                maxLength={20}
                validationMessagePosition="down"
                onValueChange={(e) => {
                  const updatedItems = [...receiptData.receiptDetail];
                  updatedItems[index].discountPercent = e;
                  setReceiptData((prevState) => ({
                    ...prevState,
                    receiptDetail: updatedItems,
                  }));
                }}
              >
                <Validator>
                  <RequiredRule message="Please Enter Discount Percent" />
                </Validator>
              </TextBox>
            </Col>
            <Col>
              <TextBox
                name="discount"
                label="Discount Amount"
                labelMode="floating"
                placeholder="Discount Amount"
                value={calculateDiscountAmount(item)}
                maxLength={20}
                validationMessagePosition="down"
                readOnly={true}
              ></TextBox>
            </Col>
            <Col>
              <TextBox
                name="amount"
                label="Amount"
                labelMode="floating"
                placeholder="Amount"
                value={calculateAmount(item)}
                maxLength={20}
                validationMessagePosition="down"
                readOnly={true}
              ></TextBox>
            </Col>
          </div>
        ))}
        <Button variant="primary" onClick={handleAddRow}>
          Add Item
        </Button>
        <TextBox
          name="totalQuantity"
          label="Total Quantity"
          labelMode="floating"
          placeholder="Total Quantity"
          value={totalQuantity}
          maxLength={20}
          readOnly={true}
        ></TextBox>
        <TextBox
          name="netAmount"
          label="Net Amount"
          labelMode="floating"
          placeholder="Net Amount"
          value={receiptData.netAmount}
          readOnly={true}
          maxLength={20}
        ></TextBox>
        <TextBox
          name="remarks"
          label="Remarks"
          labelMode="floating"
          placeholder="Remarks"
          value={receiptData.remarks}
          valueChangeEvent="input"
          onValueChange={(e) => handleChange("remarks", e)}
          showClearButton={true}
          maxLength={40}
          validationMessagePosition="down"
        >
          <Validator>
            <RequiredRule message="Please Enter Remarks" />
          </Validator>
        </TextBox>

        <div className="d-flex justify-content-end gap-2 mt-3">
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

export default ReceiptModal;
