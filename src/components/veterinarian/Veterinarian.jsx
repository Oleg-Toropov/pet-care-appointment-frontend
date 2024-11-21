import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import UserImage from "../common/UserImage";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import Review from "../review/Review";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getUserById } from "../user/UserService";
import AlertMessage from "../common/AlertMessage";
import RatingStars from "../rating/RatingStars";
import Rating from "../rating/Rating";
import Paginator from "../common/Paginator";
import LoadSpinner from "../common/LoadSpinner";

const Veterinarian = () => {
  const [vet, setVet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { vetId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewPerPage] = useState(5);

  const { errorMessage, showErrorAlert, setErrorMessage, setShowErrorAlert } =
    UseMessageAlerts();

  const getUser = async () => {
    setIsLoading(true);
    try {
      const result = await getUserById(vetId);
      setVet(result.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setErrorMessage(error.result.data.message);
      setShowErrorAlert(true);
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
              <Link to={"/doctors"}>
                <BsFillArrowRightSquareFill /> вернуться к ветеринарам
              </Link>
            </Col>
          </Row>
          <Card.Body>
            <Card.Title>
              Dr. {vet.firstName} {vet.lastName}
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
              className="link"
            >
              Записаться на прием
            </Link>
            <hr />
            <p className="about">
              О ветеринаре {vet.firstName} {vet.lastName}{" "}
            </p>
            //TODO change
            <p>
              Опытный ветеринар с более чем 7-летним стажем работы с мелкими
              домашними животными. Специализируется на диагностике, лечении и
              профилактике заболеваний, включая хирургические вмешательства и
              экстренную помощь. В своей практике применяет индивидуальный
              подход к каждому пациенту, заботясь о его здоровье и благополучии.
              Постоянно совершенствует профессиональные навыки, посещая курсы и
              семинары для освоения современных методов лечения. Основной
              приоритет — обеспечение качественного медицинского обслуживания и
              поддержка владельцев животных.
            </p>
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
