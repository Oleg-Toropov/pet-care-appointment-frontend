import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import UserImage from "../common/UserImage";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import Review from "../review/Review";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getUserById } from "../user/UserService";
import { getBiographyById } from "./VeterinarianService";
import AlertMessage from "../common/AlertMessage";
import RatingStars from "../rating/RatingStars";
import Rating from "../rating/Rating";
import Paginator from "../common/Paginator";
import LoadSpinner from "../common/LoadSpinner";

const Veterinarian = () => {
  const [vet, setVet] = useState(null);
  const [biography, setBiography] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { vetId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewPerPage] = useState(5);

  const { errorMessage, showErrorAlert, setErrorMessage, setShowErrorAlert } =
    UseMessageAlerts();

  const getUser = async () => {
    setIsLoading(true);
    try {
      const userResult = await getUserById(vetId);
      setVet(userResult.data);

      const biographyResult = await getBiographyById(vetId);
      setBiography(biographyResult.data.biography);

      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Ошибка загрузки данных"
      );
      setShowErrorAlert(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [vetId]);

  const vetReviews = vet?.reviews || [];
  const indexOfLastReview = currentPage * reviewPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewPerPage;
  const currentReviews =
    vetReviews.slice(indexOfFirstReview, indexOfLastReview) || [];

  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      {showErrorAlert && (
        <AlertMessage type={"danger"} message={errorMessage} />
      )}
      {vet && (
        <Card className="review-card mt-2">
          <Row>
            <Col>
              <UserImage
                userId={vet.id}
                userPhoto={vet.photo}
                altText={`${vet.firstName}'s photo`}
              />
            </Col>
            <Col className="text-end">
              <Link className="text-highlight" to={"/doctors"}>
                <BsFillArrowRightSquareFill /> вернуться к ветеринарам
              </Link>
            </Col>
          </Row>
          <Card.Body>
            <Card.Title>
              {vet.firstName} {vet.lastName}
            </Card.Title>
            <Card.Text>Специализация: {vet.specialization}</Card.Text>
            {vet.averageRating > 0 && (
              <Card.Text className="rating-stars">
                Рейтинг: {Number(vet.averageRating.toFixed(1))}
                <RatingStars rating={vet.averageRating} /> (
                {vet.totalReviewers || 0})
              </Card.Text>
            )}
            <Link
              to={`/book-appointment/${vet.id}/new-appointment`}
              state={{
                specialization: vet.specialization,
                firstName: vet.firstName,
                lastName: vet.lastName,
              }}
              className="link"
            >
              Записаться на прием
            </Link>
            <hr />
            <h3>
              О ветеринаре {vet.firstName} {vet.lastName}
            </h3>
            <p>
              {biography ||
                "Информация о ветеринаре пока отсутствует, но вскоре появится!"}
            </p>{" "}
            <hr />
            <Rating veterinarianId={vet.id} onReviewSubmit={null} />
            <h4 className="text-center mb-4">Отзывы</h4>
            <hr />
            {currentReviews && currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  userType={vet.userType}
                />
              ))
            ) : (
              <p>Отзывов пока нет</p>
            )}
            <Paginator
              itemsPerPage={reviewPerPage}
              totalItems={vet.reviews.length}
              paginate={setCurrentPage}
              currentPage={currentPage}
            ></Paginator>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Veterinarian;
