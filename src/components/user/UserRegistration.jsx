import { useState } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import VetSpecializationSelector from "../veterinarian/VetSpecializationSelector";
import { registerUser } from "./UserService";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UserRegistration = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "",
    userType: "",
    specialization: "",
  });
  const {
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
    showSuccessAlert,
    showErrorAlert,
    setShowSuccessAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const [isProcessing, setIsProcessing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await registerUser(user);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      handleReset();
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUser({
      firstName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      email: "",
      password: "",
      userType: "",
      specialization: "",
    });
    setShowErrorAlert(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header as="h5" className="mb-4 text-center">
                Форма регистрации пользователя
              </Card.Header>
              <Card.Body>
                <fieldset className="mb-3">
                  <legend className="legend">Полное имя</legend>
                  <Row>
                    <Col xs={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Имя"
                        value={user.firstName}
                        onChange={handleInputChange}
                        className="shadow"
                        required
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Фамилия"
                        value={user.lastName}
                        onChange={handleInputChange}
                        className="shadow"
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>

                <Form.Group as={Row} controlId="gender" className="mb-3">
                  <Col>
                    <Form.Label className="legend">Пол</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      required
                      value={user.gender}
                      onChange={handleInputChange}
                      className="shadow"
                    >
                      <option value="" disabled hidden>
                        Выберите пол
                      </option>
                      <option value="Male">Мужской</option>
                      <option value="Female">Женский</option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                <fieldset className="mb-3">
                  <legend className="legend">Контактная информация</legend>
                  <Row>
                    <Col sm={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        placeholder="Электронная почта"
                        value={user.email}
                        onChange={handleInputChange}
                        className="shadow"
                        autoComplete="email"
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        required
                        placeholder="Номер телефона"
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                        className="shadow"
                      />
                    </Col>
                  </Row>
                </fieldset>
                <Form.Group as={Row} controlId="password" className="mb-3">
                  <Col>
                    <Form.Label className="legend">Пароль</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Установите пароль"
                        value={user.password}
                        onChange={handleInputChange}
                        className="shadow"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="user-type" className="mb-4">
                  <Col>
                    <Form.Label className="legend">Тип аккаунта</Form.Label>
                    <Form.Control
                      as="select"
                      name="userType"
                      required
                      value={user.userType}
                      onChange={handleInputChange}
                      className="shadow"
                    >
                      <option value="" disabled hidden>
                        Выберите тип аккаунта
                      </option>
                      <option value="VET">Я ветеринар</option>
                      <option value="PATIENT">
                        Я владелец домашнего животного
                      </option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                {user.userType === "VET" && (
                  <Form.Group>
                    <Row>
                      <Col>
                        <VetSpecializationSelector
                          value={user.specialization}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                )}

                {showErrorAlert && (
                  <AlertMessage type={"danger"} message={errorMessage} />
                )}
                {showSuccessAlert && (
                  <AlertMessage type={"success"} message={successMessage} />
                )}

                <div className="d-flex justify-content-center mb-3">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Обработка регистрации..." />
                    ) : (
                      "Зарегистрироваться"
                    )}
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleReset}
                  >
                    Очистить
                  </Button>
                </div>

                <div className="text-center">
                  Вы уже зарегистрированы?{" "}
                  <Link to={"/login"} style={{ textDecoration: "none" }}>
                    Войдите здесь
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistration;
