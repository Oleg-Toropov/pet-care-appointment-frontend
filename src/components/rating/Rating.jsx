import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Form, Button } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { addReview } from "../review/ReviewService";

const Rating = ({ veterinarianId, onReviewSubmit }) => {
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");

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

  const reviewerId = 3; //TODO delete

  // const{veterinarianId} = useParams()

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setErrorMessage("Пожалуйста, выберите количество звезд для оценки.");
      setShowErrorAlert(true);
      return;
    }

    const reviewInfo = {
      stars: rating,
      feedback: feedback,
    };

    try {
      const response = await addReview(veterinarianId, reviewerId, reviewInfo);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage(
          "Пожалуйста, войдите в систему, чтобы отправить отзыв."
        );
        setShowErrorAlert(true);
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Произошла ошибка при отправке отзыва."
        );
        setShowErrorAlert(true);
      }
    }
  };

  return (
    <React.Fragment>
      {showErrorAlert && (
        <AlertMessage type={"danger"} message={errorMessage} />
      )}
      {showSuccessAlert && (
        <AlertMessage type={"success"} message={successMessage} />
      )}

      <Form onSubmit={handleSubmit}>
        <h3>Рейтинг ветеринара : </h3>
        <div className="mb-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <Form.Label key={index} className="me-2">
                <Form.Control
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onChange={() => handleRatingChange(ratingValue)}
                  checked={rating === ratingValue}
                />
                <FaStar
                  size={20}
                  className="star"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </Form.Label>
            );
          })}
        </div>
        <Form.Group controlId="feedback">
          <Form.Control
            as="textarea"
            row={4}
            value={feedback}
            required
            onChange={handleFeedbackChange}
            placehilder="Оставьте отзыв"
          />
        </Form.Group>
        <div className="mt-2">
          <Button type="submit" variant="outline-primary">
            Отправить отзыв
          </Button>
        </div>
        <p>
          Вы оценили этого врача на{" "}
          <span style={{ color: "orange" }}>{rating} звезд</span>
        </p>
      </Form>
    </React.Fragment>
  );
};

export default Rating;
