import { Button } from "@components";
import { ClientChangePasswordForm } from "@components/Forms/Client";
import { Modal } from "react-bootstrap";

const ChangePasswordModal = ({ hide, isOpen }) => {
  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex items-center w-full justify-between">
        <Modal.Title>
          <h3 className="font-heading first-letter:uppercase text-base font-semibold">
            Update Password
          </h3>
        </Modal.Title>
        <Button className="-mr-2 flex h-8 w-8 items-center justify-center p-2" onClick={hide}>
          <img src="/icons/xmark.svg" alt="close" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <ClientChangePasswordForm />
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
