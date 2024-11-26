import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "./UserService";
import {
  getBiographyById,
  saveVetBiography,
  updateVetBiography,
} from "../veterinarian/VeterinarianService";
import { Container, Form, Button, Card, Col, Row } from "react-bootstrap";
import VetSpecializationSelector from "../veterinarian/VetSpecializationSelector";
import ProcessSpinner from "../common/ProcessSpinner";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";

const UserUpdate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    gender: "",
    phoneNumber: "",
    specialization: "",
  });

  const [biography, setBiography] = useState("");
  const [biographyId, setBiographyId] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUserById(userId);
        setUserData(userResponse.data);

        if (userResponse.data.userType === "VET") {
          const biographyResponse = await getBiographyById(userId);
          if (biographyResponse) {
            setBiography(biographyResponse.data.biography || "");
            setBiographyId(biographyResponse.data.id);
          }
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Ошибка загрузки данных"
        );
        setShowErrorAlert(false);
      }
    };

    fetchData();
  }, [userId, setErrorMessage, setShowErrorAlert]);

  const handleBiographyChange = (e) => {
    setBiography(e.target.value);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      const updatedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        userType: userData.userType,
        specialization: userData.specialization,
      };
      const response = await updateUser(updatedUserData, userId);

      if (userData.userType === "VET") {
        const biographyData = { biography: biography };

        if (biographyId) {
          await updateVetBiography(biographyId, biographyData);
        } else {
          await saveVetBiography(userId, biographyData);
        }
      }

      setSuccessMessage(response.message || "Данные успешно обновлены");
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Ошибка сохранения данных"
      );
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    navigate(`/user-dashboard/${userId}/my-dashboard`);
  };

  return (
    <Container md={6} className="d-flex justify-content-center mt-5">
      <Col md={6}>
        <Form onSubmit={handleUserUpdate}>
          <Card className="shadow mb-5">
            <Card.Header as="h5" className="mb-4 text-center">
              Обновление информации пользователя
            </Card.Header>
            <Card.Body>
              <fieldset className="mb-3">
                <legend className="legend">Полное имя</legend>
                <Row>
                  <Col xs={6} className="mb-2 mb-sm-0">
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleUserInputChange}
                      className="shadow"
                    />
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleUserInputChange}
                      className="shadow"
                    />
                  </Col>
                </Row>
              </fieldset>

              <Form.Group as={Col} controlId="gender" className="mb-3">
                <Form.Label className="legend">Пол</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={userData.gender}
                  onChange={handleUserInputChange}
                  className="shadow"
                >
                  <option value="" disabled hidden>
                    Выберите пол
                  </option>
                  <option value="Male">Мужской</option>
                  <option value="Female">Женский</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="user-type" className="mb-3">
                <Form.Label className="legend">Тип аккаунта</Form.Label>
                <Form.Control
                  type="text"
                  name="userType"
                  value={userData.userType === "VET" ? "Ветеринар" : "Пациент"}
                  disabled
                  className="shadow"
                />
              </Form.Group>

              <fieldset className="mb-3 mt-3">
                <legend className="legend">Контактная информация</legend>
                <Row>
                  <Col>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="shadow"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={handleUserInputChange}
                      className="shadow"
                    />
                  </Col>
                </Row>
              </fieldset>

              {userData.userType === "VET" && (
                <>
                  <Form.Group controlId="specialization" className="mb-4">
                    <Form.Label className="legend">Специализация</Form.Label>
                    <VetSpecializationSelector
                      value={userData.specialization}
                      onChange={handleUserInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="biography" className="mb-3">
                    <Form.Label className="legend">
                      Краткая информация о вас
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      name="vetBiography"
                      rows={4}
                      value={biography}
                      onChange={handleBiographyChange}
                      className="shadow"
                    />
                  </Form.Group>
                </>
              )}

              {showErrorAlert && (
                <AlertMessage type="danger" message={errorMessage} />
              )}
              {showSuccessAlert && (
                <AlertMessage type="success" message={successMessage} />
              )}

              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  variant="outline-warning"
                  size="sm"
                  disabled={isProcessing}
                  className="mx-2"
                >
                  {isProcessing ? (
                    <ProcessSpinner message="Обработка обновлений..." />
                  ) : (
                    "Обновить"
                  )}
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="mx-2"
                >
                  Назад в профиль
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
};

export default UserUpdate;
