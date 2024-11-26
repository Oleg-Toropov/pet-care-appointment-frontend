import { useState, useEffect } from "react";
import { BsPersonFill, BsLockFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "./AuthService";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const isAthenticated = localStorage.getItem("authToken");
    if (isAthenticated) {
      navigate(from, { replace: true });
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMessage(
        "Пожалуйста, введите действительное имя пользователя и пароль"
      );
      setShowErrorAlert(true);
      return;
    }
    try {
      const data = await loginUser(credentials.email, credentials.password);
      localStorage.setItem("authToken", data.token);

      const decoded = jwtDecode(data.token);
      localStorage.setItem("userRoles", JSON.stringify(decoded.roles));
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("userEmail", decoded.sub);

      clearLoginForm();
      navigate(from, { replace: true });
      window.location.reload();
    } catch (error) {
      const errorMsg =
        error.response?.data?.data ||
        error.response?.data?.message ||
        "Произошла ошибка";
      setErrorMessage(errorMsg);
      setShowErrorAlert(true);
    }
  };

  const clearLoginForm = () => {
    setCredentials({ email: "", password: "" });
    setShowErrorAlert(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={4}>
          <Card>
            {showErrorAlert && (
              <AlertMessage type={"danger"} message={errorMessage} />
            )}
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Вход в личный кабинет
              </Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Логин</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsPersonFill />
                    </InputGroup.Text>

                    <Form.Control
                      type="text"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      placeholder="email"
                      autoComplete="username"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Пароль</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsLockFill />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                    />

                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100"
                >
                  Войти
                </Button>
              </Form>
              <div className="text-center mt-2">
                У вас еще нет учетной записи?{" "}
                <Link to={"/register-user"} style={{ textDecoration: "none" }}>
                  Зарегистрируйтесь здесь
                </Link>
                <div className="mt-3">
                  <Link
                    to={"/password-rest-request"}
                    style={{ textDecoration: "none" }}
                  >
                    Забыли пароль?
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
