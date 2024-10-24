import React, { useState, useEffect } from "react";
import AddItemModal from "../modals/AddItemModal";
import { Form, Col } from "react-bootstrap";
import { getAllSpecializations } from "./VeterinarianService";

const VetSpecializationSelector = ({ value, onChange }) => {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllSpecializations = async () => {
      try {
        const result = await getAllSpecializations();
        setSpecializations(result.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchAllSpecializations();
  }, []);

  const handleSpecializationChange = (e) => {
    if (e.target.value === "add-new-specialization") {
      setShowModal(true);
    } else {
      onChange(e);
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
          <option value="">Выберите специализацию</option>
          <option value="add-new-specialization">
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
