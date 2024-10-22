import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getPetTypes } from "./PetService";

const PetTypeSelector = ({ value, onChange }) => {
  const [petTypes, setPetTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const response = await getPetTypes();
        setPetTypes(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchPetTypes();
  }, []);

  const handleTypeChange = (e) => {
    if (e.target.value === "add-new-item") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newItem) => {
    if (newItem && !petTypes.includes(newItem)) {
      setPetTypes([...petTypes, newItem]);
      onChange({ target: { name: "petType", value: newItem } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Col} controlId="petType">
        <Form.Control
          as="select"
          name="petType"
          value={value}
          required
          onChange={handleTypeChange}
        >
          <option value="">Тип питомца</option>
          <option value="add-new-item">Добавить новый тип</option>
          {petTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel={"Type"}
      />
    </React.Fragment>
  );
};

export default PetTypeSelector;
