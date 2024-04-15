import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, handleClose, handleDelete,deleteMessage,darkMode,inUseError }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>{deleteMessage}
            <p style={{ fontSize: "x-small", color: "red" }}>{inUseError ? "This is already in use." : ""}</p>
            
            </Modal.Body>
            <Modal.Footer className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;