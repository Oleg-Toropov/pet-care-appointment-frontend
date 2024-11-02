import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "./UserService";
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
    const getUserData = async () => {
      try {
        const data = await getUserById(userId);
        setUserData(data.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    getUserData();
  }, [userId]);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const updatedUserData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      userType: userData.userType,
      specialization: userData.specialization,
    };
    try {
      setIsProcessing(true);
      const response = await updateUser(updatedUserData, userId);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
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
        <Form onSubmit={(e) => handleUserUpdate(e)}>
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
                      style={{ marginRight: "10px" }}
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
                  <option value="">Выберите пол</option>
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
                  onChange={handleUserInputChange}
                  disabled
                />
              </Form.Group>

              <fieldset className="mb-3 mt-3">
                <legend className="legend">Контактная информация</legend>
                <Form.Group
                  as={Col}
                  controlId="emailPhoneFields"
                  className="d-flex"
                >
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleUserInputChange}
                    style={{ marginRight: "10px" }}
                    disabled
                  />
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Mobile Contact"
                    value={userData.phoneNumber}
                    onChange={handleUserInputChange}
                    className="shadow"
                  />
                </Form.Group>
              </fieldset>

              {userData.userType === "VET" && (
                <Form.Group controlId="specialization" className="mb-4">
                  <Form.Label className="legend">Специализация</Form.Label>
                  <VetSpecializationSelector
                    value={userData.specialization}
                    onChange={handleUserInputChange}
                  />
                </Form.Group>
              )}

              {showErrorAlert && (
                <AlertMessage type="danger" message={errorMessage} />
              )}
              {showSuccessAlert && (
                <AlertMessage type="success" message={successMessage} />
              )}

              <div className="d-flex justify-content-center">
                <div className="mx-2">
                  <Button
                    type="submit"
                    variant="outline-warning"
                    size="sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Обработка обновлений..." />
                    ) : (
                      "Обновить"
                    )}
                  </Button>
                </div>
                <div className="mx-2">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Назад в профиль
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
};

export default UserUpdate;
