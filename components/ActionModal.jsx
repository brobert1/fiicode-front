import { Button } from "@components";
import { classnames } from "@lib";
import Modal from "react-bootstrap/Modal";

const variants = {
  danger: {
    confirmClass: "border-black bg-black text-white hover:text-red-500",
    iconColor: "bg-red-100 text-red-600",
    icon: "fa-regular fa-triangle-exclamation",
  },
  primary: {
    confirmClass: "border-primary bg-primary text-white",
    iconColor: "bg-primary text-white",
    icon: "fa-regular fa-info-circle",
  },
  success: {
    confirmClass: "border-green-500 bg-green-500 text-white",
    iconColor: "bg-green-100 text-green-600",
    icon: "fa-regular fa-check-circle",
  },
  warning: {
    confirmClass: "border-yellow-500 bg-yellow-500 text-black",
    iconColor: "bg-yellow-100 text-yellow-600",
    icon: "fa-regular fa-exclamation-circle",
  },
};

export const ActionFooter = ({
  cancelText = "Cancel",
  confirmText = "Delete",
  hide,
  isLoading,
  onConfirm = () => {},
  variant = "danger",
}) => {
  const { confirmClass } = variants[variant] || variants["danger"];

  return (
    <div className="flex justify-end gap-4">
      <Button
        className="button full border border-tertiary bg-tertiary text-black hover:border-white/10"
        disabled={isLoading}
        onClick={hide}
      >
        {cancelText}
      </Button>
      <div className="flex items-center">
        <Button
          className={classnames("button full", confirmClass)}
          disabled={isLoading}
          onClick={onConfirm}
          type="submit"
        >
          {confirmText}
        </Button>
        {isLoading && <img src="/icons/loading.gif" alt="loading" className="mx-1 w-6" />}
      </div>
    </div>
  );
};

const ActionModal = ({
  cancelText,
  children,
  confirmText,
  hide,
  isLoading,
  isOpen,
  onConfirm,
  showFooter = true,
  title = "Confirm operation",
  variant = "danger",
}) => {
  const { iconColor, icon } = variants[variant] || variants["danger"];

  return (
    <Modal show={isOpen} onHide={hide} backdrop="static" keyboard={false} centered>
      <Modal.Header className="flex border-b border-white/10 items-center justify-between">
        <Modal.Title>
          <div className="flex items-center gap-2 leading-tight">
            <div
              className={classnames(
                "flex aspect-square h-8 w-8 items-center justify-center rounded-full",
                iconColor
              )}
            >
              <i className={icon}></i>
            </div>
            {title}
          </div>
        </Modal.Title>
        <Button
          className="-mr-2 flex h-8 w-8 items-center justify-center p-2"
          disabled={isLoading}
          onClick={hide}
        >
          <img src="/icons/xmark.svg" alt="close" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="max-w-full break-words">{children}</div>
      </Modal.Body>
      {showFooter && (
        <Modal.Footer>
          <ActionFooter
            cancelText={cancelText}
            confirmText={confirmText}
            hide={hide}
            isLoading={isLoading}
            onConfirm={onConfirm}
            variant={variant}
          />
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ActionModal;
