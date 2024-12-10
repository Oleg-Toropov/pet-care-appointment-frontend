import { Accordion, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserImage from "../common/UserImage";
import RatingStars from "../rating/RatingStars";

const VeterinarianCard = ({ vet, eventKey, activeKey, onToggle }) => {
  const isActive = activeKey === eventKey;

  return (
    <Col xs={12} className="mb-4">
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Header onClick={() => onToggle(eventKey)}>
            <div className="d-flex align-items-center">
              <Link to={""}>
                <UserImage userId={vet.id} userPhoto={vet.photo} />
              </Link>
            </div>
            <div className="flex-grow-1 ml-3 px-5">
              <Card.Title className="title">
                {vet.firstName} {vet.lastName}
              </Card.Title>
              <Card.Title>
                <h6> {vet.specialization} </h6>
              </Card.Title>
              <Card.Text className="review rating-stars">
                Рейтинг: <RatingStars rating={vet.averageRating} /> (
                {vet.totalReviewers})
              </Card.Text>

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
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <Link
                to={`/Veterinarian/${vet.id}/veterinarian`}
                className="link-2"
              >
                Подробная информация о ветеринаре {vet.firstName} и отзывы
                клиентов
              </Link>{" "}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default VeterinarianCard;
