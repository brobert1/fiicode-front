import { useState, useEffect } from "react";
import { Field, Form, HookForm, Submit } from "@components/HookForm";
import { Input } from "@components/Fields";
import { Button } from "@components";
import * as yup from "yup";
import LocationMapModal from "./LocationMapModal";

const TodoForm = ({ onAddTodo }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  const validationSchema = yup.object({
    description: yup.string().required("Description is required"),
  });

  const initialValues = {
    description: "",
  };

  const handleSubmit = (values, methods) => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    onAddTodo({
      description: values.description,
      location: selectedLocation,
    });

    // Reset form
    methods.reset();
    setSelectedLocation(null);
  };

  const handleSelectLocation = () => {
    setShowMap(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowMap(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-secondary">
      <h3 className="text-lg text-secondary font-medium mb-4">Add New Todo</h3>

      <HookForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Field
              id="description"
              name="description"
              as={Input}
              placeholder="Enter todo description"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <Button
              type="button"
              onClick={handleSelectLocation}
              className="flex items-center gap-2 w-full py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {selectedLocation
                ? `Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                : "Select on Map"}
            </Button>
          </div>

          <Submit className="button primary w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-secondary hover:bg-gray-800 focus:outline-none">
            Add Todo
          </Submit>
        </Form>
      </HookForm>

      <LocationMapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={currentLocation}
      />
    </div>
  );
};

export default TodoForm;
