import React, { useState, useEffect } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { validateToken, resetPassword } from "./AuthService";
import ProcessSpinner from "../common/ProcessSpinner";

const ResetPassword = () => {
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
            <Card.Title>Сбросьте свой пароль</Card.Title>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailInput">
                <Form.Label>Установите новый пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="введите новый пароль"
                />
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
