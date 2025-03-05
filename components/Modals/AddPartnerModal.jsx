import { AddPartnerForm } from "@components/Forms/Admin";

const { Button } = require("@components");
const { Modal } = require("react-bootstrap");

const AddPartnerModal = ({ isOpen, hide }) => {
  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading text-base font-semibold">Add Partner</h3>
        </Modal.Title>
        <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
          <i className="fas fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <AddPartnerForm hide={hide} />
      </Modal.Body>
    </Modal>
  );
};

export default AddPartnerModal;
