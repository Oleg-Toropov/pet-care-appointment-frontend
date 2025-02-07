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

    setErrorMessage("");
    setShowErrorAlert(false);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("Файл слишком большой. Максимальный размер: 2MB.");
        setShowErrorAlert(true);
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const getUser = async () => {
    try {
      const result = await getUserById(userId);
      setUser(result.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Ошибка загрузки пользователя"
      );
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    if (show) {
      getUser();
    }
  }, [userId, show]);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        setErrorMessage("Выберите фотографию для загрузки");
        setShowErrorAlert(true);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      let response;
      if (user?.photoId) {
        response = await updateUserPhoto(user.photoId, file);
      } else {
        response = await uploadUserPhoto(userId, file);
      }

      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setErrorMessage("");
      setShowErrorAlert(false);
      window.location.reload();
    } catch (error) {
      setSuccessMessage("");
      setShowSuccessAlert(false);

      setErrorMessage(error.message || "Ошибка загрузки фото");
      setShowErrorAlert(true);
    }
  };

  const handleModalClose = () => {
    setFile(null);
    setErrorMessage("");
    setShowErrorAlert(false);
    setSuccessMessage("");
    setShowSuccessAlert(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
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
