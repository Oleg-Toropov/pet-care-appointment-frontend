import { useEffect, useState } from "react";
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

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("Файл слишком большой. Максимальный размер: 2MB.");
        setShowErrorAlert(true);
        setFile(null);
      } else {
        setErrorMessage("");
        setShowErrorAlert(false);
        setFile(selectedFile);
      }
    }
  };

  const getUser = async () => {
    try {
      const result = getUserById(userId);
      setUser(result.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
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
        const response = await updateUserPhoto(user.photoId, file);
        setSuccessMessage(response.message);
        setShowSuccessAlert(true);
        window.location.reload();
      } else {
        const response = await uploadUserPhoto(userId, file);

        setShowErrorAlert(false);
        setErrorMessage("");

        setSuccessMessage(response.message);
        setShowSuccessAlert(true);
        window.location.reload();
      }
    } catch (error) {
      setShowSuccessAlert(false);
      setSuccessMessage("");

      if (error.status === 400) {
        setErrorMessage("Выберите фотографию для загрузки");
        setShowErrorAlert(true);
        return;
      }
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Загрузить фотографию</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}

        <Form>
          <h6>
            Выберите фотографию, которую вы хотели бы разместить в своем профиле
          </h6>
          <InputGroup>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button variant="secondary" onClick={handleImageUpload}>
              Загрузить
            </Button>
          </InputGroup>
        </Form>
        {file && (
          <div className="text-center mt-3">
            <img
              src={URL.createObjectURL(file)}
              alt="Предпросмотр"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageUploaderModal;
