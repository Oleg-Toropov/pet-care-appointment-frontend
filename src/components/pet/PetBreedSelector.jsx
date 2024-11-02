import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getAllPetBreeds } from "./PetService";

const PetBreedSelector = ({ petType, value, onChange }) => {
  const [petBreeds, setPetBreeds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (petType) {
      const fetchAllPetBreeds = async () => {
        const response = await getAllPetBreeds(petType);
        setPetBreeds(response.data);
      };
      fetchAllPetBreeds();
    } else {
      setPetBreeds([]);
    }
  }, [petType]);

  const handleBreedChange = (e) => {
    if (e.target.value === "add-new-item") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newItem) => {
    if (newItem && !petBreeds.includes(newItem)) {
      setPetBreeds([...petBreeds, newItem]);
      onChange({ target: { name: "petBreed", value: newItem } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Col} controlId="petBreed">
        <Form.Control
          as="select"
          name="petBreed"
          value={value}
          required
          onChange={handleBreedChange}
        >
          <option value="">Порода питомца</option>
          {petBreeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
          <option value="add-new-item">Добавить новую породу</option>
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel={"Breed"}
      />
    </React.Fragment>
  );
};

export default PetBreedSelector;
