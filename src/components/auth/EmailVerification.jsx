import { useState, useEffect } from "react";
import { verifyEmail, resendVerificationToken } from "./AuthService";
import ProcessSpinner from "../common/ProcessSpinner";

const EmailVerification = () => {
  const [verificationMessage, setVerificationMessage] = useState(
    "Подтверждение вашей электронной почты, пожалуйста подождите...."
  );
  const [alertType, setAlertType] = useState("alert-info");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      verifyEmailToken(token);
    } else if (!token) {
      setVerificationMessage("Токен не предоставлен.");
      setAlertType("alert-danger");
    }
  }, []);

  const verifyEmailToken = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verifyEmail(token);
      switch (response.message) {
        case "VALID":
          setVerificationMessage(
            "Ваша электронная почта была успешно подтверждена, вы можете войти в систему."
          );
          setAlertType("alert-success");
          break;
        case "VERIFIED":
          setVerificationMessage(
            "Этот адрес электронной почты уже был подтвержден, пожалуйста, войдите в систему."
          );
          setAlertType("alert-info");
          break;
        default:
          setVerificationMessage("Произошла непредвиденная ошибка.");
          setAlertType("alert-danger");
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message && message === "INVALID") {
          setVerificationMessage(
            "Эта ссылка для подтверждения недействительна."
          );
          setAlertType("alert-danger");
        } else {
          setVerificationMessage(
            "Срок действия этой ссылки для подтверждения истек, пожалуйста, повторите попытку."
          );
          setAlertType("alert-warning");
        }
      } else {
        setVerificationMessage("Не удалось подключиться к серверу.");
        setAlertType("alert-danger");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendToken = async () => {
    setIsProcessing(true);
    const queryParams = new URLSearchParams(location.search);
    const oldToken = queryParams.get("token");
    try {
      if (!oldToken) {
        return;
      }

      const response = await resendVerificationToken(oldToken);
      setVerificationMessage(response.message);
      setAlertType("alert-success");
    } catch (error) {
      console.log("The error : " + error);
      let message = "Failed to resend verification token.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      setVerificationMessage(message);
      setAlertType("alert-danger");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="d-flex justify-content-center  mt-lg-5">
      {isProcessing ? (
        <ProcessSpinner message="Пожалуйста, подождите, пока мы обрабатываем ваш запрос..." />
      ) : (
        <div className="col-12 col-md-6">
          <div className={`alert ${alertType}`} role="alert">
            {verificationMessage}

            {alertType === "alert-warning" && (
              <button onClick={handleResendToken} className="btn btn-link">
                Повторно отправьте ссылку для подтверждения
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
