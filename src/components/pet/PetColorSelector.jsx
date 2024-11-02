import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getAllPetColors } from "./PetService";

const PetColorSelector = ({ value, onChange }) => {
  const [petColors, setPetColors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllPetColors = async () => {
      const response = await getAllPetColors();
      setPetColors(response.data);
    };
    fetchAllPetColors();
  }, []);

  const handleColorChange = (e) => {
    if (e.target.value === "add-new-item") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newItem) => {
    if (newItem && !petColors.includes(newItem)) {
      setPetColors([...petColors, newItem]);
      onChange({ target: { name: "petColor", value: newItem } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Col} controlId="petColor" className="mb-2">
        <Form.Control
          as="select"
          name="petColor"
          value={value}
          required
          onChange={handleColorChange}
        >
          <option value="">Цвет питомца</option>
          {petColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
          <option value="add-new-item">Добавить новый цвет</option>
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel={"Color"}
      />
    </React.Fragment>
  );
};

export default PetColorSelector;
