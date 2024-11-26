import React, { useState, useEffect } from "react";
import AddItemModal from "../modals/AddItemModal";
import { Form, Col } from "react-bootstrap";
import { getAllSpecializations } from "./VeterinarianService";

const VetSpecializationSelector = ({ value, onChange }) => {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllSpecializations = async () => {
      const result = await getAllSpecializations();
      setSpecializations(result.data);
    };
    fetchAllSpecializations();
  }, []);

  const handleSpecializationChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add-new-specialization") {
      setShowModal(true);
    } else {
      onChange({ target: { name: "specialization", value: selectedValue } });
    }
  };

  const handleSaveNewItem = (newItem) => {
    if (newItem && !specializations.includes(newItem)) {
      setSpecializations([...specializations, newItem]);
      onChange({ target: { name: "specialization", value: newItem } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Col} controlId="specialization" className="mb-4">
        <Form.Control
          as="select"
          name="specialization"
          value={value}
          required
          onChange={handleSpecializationChange}
        >
          <option value="" disabled hidden>
            Выберите специализацию
          </option>
          <option value="add-new-specialization" className="highlight-option">
            Добавить новую специализацию
          </option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel={"Specialization"}
      />
    </React.Fragment>
  );
};

export default VetSpecializationSelector;
