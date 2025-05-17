import { Modal } from "react-bootstrap";
import { APIProvider } from "@vis.gl/react-google-maps";
import SimpleRouteMap from "./SimpleRouteMap";

const RouteMapModal = ({ isOpen, onClose, todos }) => {
  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Route</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="relative" style={{ height: "80vh" }}>
          <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={["places", "routes"]}>
            <SimpleRouteMap todos={todos} />
          </APIProvider>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RouteMapModal;
