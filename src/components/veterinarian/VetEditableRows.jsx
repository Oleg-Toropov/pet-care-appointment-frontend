import { useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import VetSpecializationSelector from "./VetSpecializationSelector";
import { Button, Form } from "react-bootstrap";

const VetEditableRows = ({ vet, onSave, onCancel }) => {
  const [editedVet, setEditedVet] = useState(vet);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedVet((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    onSave(vet.id, editedVet, onCancel);
  };

  return (
    <tr>
      <td>
        <Form.Control
          type="text"
          name="firstName"
          value={editedVet.firstName}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="lastName"
          value={editedVet.lastName}
          onChange={handleInputChange}
        />
      </td>

      <td>
        <Form.Control
          type="email"
          name="email"
          value={editedVet.email}
          onChange={handleInputChange}
          disabled
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="phoneNumber"
          value={editedVet.phoneNumber}
          onChange={handleInputChange}
        />
      </td>

      <td>
        <Form.Control
          as="select"
          name="gender"
          value={editedVet.gender}
          onChange={handleInputChange}
        >
          <option value="">Выберите пол</option>
          <option value="Male">Мужской</option>
          <option value="Female">Женский</option>
        </Form.Control>
      </td>

      <td>
        <VetSpecializationSelector
          value={editedVet.specialization}
          onChange={handleInputChange}
        />
      </td>

      <td>
        <Form.Control
          type="createdAt"
          name="createdAt"
          value={new Date(editedVet.createdAt).toLocaleDateString("ru-RU")}
          onChange={handleInputChange}
          disabled
        />
      </td>

      <td>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={handleSave}
            className="me-2"
          >
            <BsCheck />
          </Button>

          <Button variant="secondary" size="sm" onClick={onCancel}>
            <BsX />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default VetEditableRows;
