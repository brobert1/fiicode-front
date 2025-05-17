import { Modal } from "react-bootstrap";
import { APIProvider } from "@vis.gl/react-google-maps";
import SimpleLocationMap from "./SimpleLocationMap";

const LocationMapModal = ({ isOpen, onClose, onLocationSelect, initialLocation }) => {
  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="relative" style={{ height: "70vh" }}>
          <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={["places", "routes"]}>
            <SimpleLocationMap
              initialLocation={initialLocation}
              onLocationSelect={onLocationSelect}
            />
          </APIProvider>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LocationMapModal;
