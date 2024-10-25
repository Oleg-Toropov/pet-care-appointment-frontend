import React, { useEffect, useState } from "react";
import AlertMessage from "../common/AlertMessage";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { updateUserPhoto, uploadUserPhoto } from "./ImageUploaderService";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getUserById } from "../user/UserService";

const ImageUploaderModal = ({ userId, show, handleClose }) => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const getUser = async () => {
    try {
      const result = getUserById(3);
      setUser(result.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      console.error(error.message);
    }
  };
  useEffect(() => {
    getUser();
  }, [userId]);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (user && user.photo) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          const fileBytes = new Uint8Array(e.target.result);
          const response = await updateUserPhoto(user.photoId, fileBytes);
          setSuccessMessage(response.data);
          window.location.reload();
          setShowSuccessAlert(true);
        };
      } else {
        const response = await uploadUserPhoto(3, file);
        setSuccessMessage(response.data);
        window.location.reload();
        setShowSuccessAlert(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Загрузить фотографию</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {showErrorAlert && (
          <AlertMessage type={"danger"} messsag={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} messsag={successMessage} />
        )}

        <Form>
          <h6>
            Выберите фотографию, которую вы хотели бы разместить в своем профиле
          </h6>
          <InputGroup>
            <Form.Control type="file" onChange={handleFileChange} />
            <Button variant="secondary" onClick={handleImageUpload}>
              Загрузить
            </Button>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImageUploaderModal;
