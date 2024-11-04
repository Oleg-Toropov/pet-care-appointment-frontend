import React, { useState } from "react";
import { eyeOff, eyeOn } from "react-icons-kit/feather";
import { Icon } from "react-icons-kit";
import { changeUserPassword } from "../user/UserService";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Form, Modal, Row, Col, InputGroup, Button } from "react-bootstrap";

const ChangePasswordModal = ({ userId, show, handleClose }) => {
  const [type, setType] = useState("password");
  const { icon, setIcon } = useState(eyeOff);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await changeUserPassword(
        // userId, // TODO delete
        3,
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmNewPassword
      );
      setSuccessMessage(response.message);
      handleReset();
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleShowPassword = () => {
    if (type === "password") {
      setType("text");
      setIcon(eyeOn);
    } else {
      setType("password");
      setIcon(eyeOff);
    }
  };

  const handleReset = () => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Сменить пароль</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="currentPassword">
            <Form.Label>Текущий пароль:</Form.Label>
            <InputGroup>
              <Form.Control
                type={type}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleInputChange}
              />
              <InputGroup.Text onClick={handleShowPassword}>
                {/*eye*/}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="newPassword" className="mb-2">
            <Form.Label>Новый пароль:</Form.Label>
            <Form.Control
              type={type}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="confirmNewPassword" className="mb-2">
            <Form.Label>Подтвердите новый пароль:</Form.Label>
            <Form.Control
              type={type}
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <div className="mx-2">
              <Button variant="secondary" size="sm" type="submit">
                Сменить пароль
              </Button>
            </div>
            <div className="mx-2 mb-4">
              <Button variant="danger" size="sm" onClick={handleReset}>
                Сбросить
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;