import PetColorSelector from "./PetColorSelector";
import PetTypeSelector from "./PetTypeSelector";
import PetBreedSelector from "./PetBreedSelector";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { FaMinus } from "react-icons/fa";

const PetEntry = ({ pet, index, removePet, canRemove, handleInputChange }) => {
  return (
    <fieldset className="field-set shadow mb-4">
      <legend className="legend">{`Информация о питомце #${index + 1}`}</legend>

      <fieldset className="mb-4 ">
        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Control
              type="text"
              name="petName"
              id={`petName-${index}`}
              value={pet.petName}
              placeholder="Кличка питомца"
              onChange={handleInputChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type="number"
              name="petAge"
              id={`petAge-${index}`}
              value={pet.petAge}
              placeholder="Возраст питомца"
              onChange={handleInputChange}
              required
              min="0"
              max="100"
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group as={Col} className="mb-4">
        <PetColorSelector
          id={`petColor-${index}`}
          value={pet.petColor}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group as={Row} className="mb-2 d-flex">
        <Col>
          <PetTypeSelector
            id={`petType-${index}`}
            value={pet.petType}
            onChange={handleInputChange}
            required
          />
        </Col>
        <Col>
          <PetBreedSelector
            id={`petBreed-${index}`}
            petType={pet.petType}
            value={pet.petBreed}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      {canRemove && (
        <div className="d-flex justify-content-end mt-2">
          <OverlayTrigger overlay={<Tooltip>Удалить питомца</Tooltip>}>
            <Button variant="danger" size="sm" onClick={() => removePet(index)}>
              <FaMinus />
            </Button>
          </OverlayTrigger>
        </div>
      )}
    </fieldset>
  );
};

export default PetEntry;
