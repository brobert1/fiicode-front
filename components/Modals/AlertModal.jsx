import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@components";
import SetAlertForm from "@components/Forms/Client/SetAlertForm";

const AlertModal = ({ isOpen, hide, location, onComplete }) => {
  // Handle form completion
  const handleFormComplete = () => {
    // Close the modal
    hide();

    // Call the parent's onComplete if provided
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading first-letter:uppercase text-base font-semibold">
            Set Location Alert
          </h3>
        </Modal.Title>
        <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
          <i className="fas fa-times"></i>
        </Button>
      </Modal.Header>

      <Modal.Body>
        <SetAlertForm location={location} onComplete={handleFormComplete} />
      </Modal.Body>
    </Modal>
  );
};

export default AlertModal;
