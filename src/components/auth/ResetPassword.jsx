import { useState, useEffect } from "react";
import { Container, Form, Card, Button, InputGroup } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { validateToken, resetPassword } from "./AuthService";
import ProcessSpinner from "../common/ProcessSpinner";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("PENDING");

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  const {
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    setShowSuccessAlert,
    showSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  useEffect(() => {
    if (token) {
      validateToken(token)
        .then((response) => {
          setTokenStatus(response.message);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setShowErrorAlert(true);
        });
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    try {
      const data = await resetPassword(token, newPassword);
      setSuccessMessage(data.message);
      setShowSuccessAlert(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
    setIsProcessing(false);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ marginTop: "100px" }}
    >
      <Card style={{ maxWidth: "600px" }} className="w-100">
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}

        {tokenStatus === "VALID" ? (
          <Card.Body>
            <Card.Title className="mb-3">Сброс пароля</Card.Title>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailInput">
                <Form.Label>Установите новый пароль</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="введите новый пароль"
                  />
                  <InputGroup.Text
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  Пароль должен быть не менее 8 символов, содержать цифры,
                  заглавные и строчные латинские буквы.
                </Form.Text>
              </Form.Group>

              <Button variant="outline-info" type="submit">
                {isProcessing ? (
                  <ProcessSpinner message="Пожалуйста, подождите, производится сброс пароль..." />
                ) : (
                  "Сброс пароля"
                )}
              </Button>
            </Form>
          </Card.Body>
        ) : tokenStatus === "PENDING" ? (
          <Card.Body>
            <ProcessSpinner message="Подтверждение токена, пожалуйста, подождите..." />
          </Card.Body>
        ) : (
          <Card.Body>
            <AlertMessage
              type={"danger"}
              message={
                "Ссылка недействительна или срок ее действия истек, процесс прерван. Пожалуйста, повторите попытку!"
              }
            />
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

export default ResetPassword;
