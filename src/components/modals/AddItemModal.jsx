import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddItemModal = ({ show, handleClose, handleSave, itemLabel }) => {
  const [itemValue, setItemValue] = useState("");

  const handleSaveItem = () => {
    handleSave(itemValue);
    setItemValue("");
    handleClose();
  };

  const handleInputChange = (e) => {
    setItemValue(e.target.value);
  };

  const getTitle = (itemLabel) => {
    if (itemLabel === "Breed") return "породы";
    if (itemLabel === "Color") return "цвета";
    if (itemLabel === "Type") return "типа";
    if (itemLabel === "Specialization") return "специализации";
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Добавление {getTitle(itemLabel)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeHolder={`Введите название ${getTitle(itemLabel)}`}
              value={itemValue}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveItem}>
            Добавить
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Отмена
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default AddItemModal;
