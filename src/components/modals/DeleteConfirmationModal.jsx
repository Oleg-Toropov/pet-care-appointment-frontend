import { Modal, Button } from "react-bootstrap";

const DeleteConfirmationModal = ({ show, onHide, onConfirm, itemToDelete }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены, что хотите удалить {itemToDelete}? Это действие невозможно
        отменить!
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>{" "}
        <Button variant="danger" onClick={onConfirm}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
