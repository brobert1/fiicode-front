import { Button } from "@components";
import { ClientEditInfoForm } from "@components/Forms/Client";
import { Modal } from "react-bootstrap";

const EditClientInfoModal = ({ client, hide, isOpen, accType }) => {
  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading first-letter:uppercase text-base font-semibold">
            Edit details
          </h3>
        </Modal.Title>
        <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
          <img src="/icons/xmark.svg" alt="close" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <ClientEditInfoForm client={client} hide={hide} accType={accType} />
      </Modal.Body>
    </Modal>
  );
};

export default EditClientInfoModal;
