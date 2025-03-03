import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { BsCheck, BsX } from "react-icons/bs";

const EditablePetRow = ({
  pet,
  index,
  onSave,
  onCancel,
  isNew,
  handleInputChange,
}) => {
  const [editPet, setEditPet] = useState(pet);

  useEffect(() => {
    if (isNew) {
      setEditPet(pet);
    }
  }, [pet, isNew]);

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    if (isNew && handleInputChange) {
      handleInputChange(e);
    } else {
      setEditPet((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <tr>
      <td>
        <Form.Control
          type="text"
          name="name"
          value={editPet.name}
          onChange={handlePetChange}
          autoComplete="off"
        />
      </td>

      <td>
        <Form.Control
          type="text"
          name="type"
          value={editPet.type}
          onChange={handlePetChange}
          autoComplete="off"
        />
      </td>

      <td>
        <Form.Control
          type="text"
          name="breed"
          value={editPet.breed}
          onChange={handlePetChange}
          autoComplete="off"
        />
      </td>

      <td>
        <Form.Control
          type="text"
          name="color"
          value={editPet.color}
          onChange={handlePetChange}
          autoComplete="off"
        />
      </td>
      <td>
        <Form.Control
          type="number"
          name="age"
          value={editPet.age}
          onChange={handlePetChange}
          autoComplete="off"
        />
      </td>
      <td>
        {" "}
        <Button
          variant="success"
          size="sm"
          onClick={() => onSave(pet.id, editPet)}
          className="me-2"
        >
          <BsCheck />
        </Button>
      </td>
      <td colSpan={2}>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <BsX />
        </Button>
      </td>
    </tr>
  );
};

export default EditablePetRow;
