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
                <UserImage
                  src={vet.photoUrl}
                  alt={`Фото пользователя ${vet.id}`}
                />
              </Link>
            </div>
            <div className="flex-grow-1 ml-3 px-5">
              <Card.Title className="title">
                {vet.firstName} {vet.lastName}
              </Card.Title>
              <Card.Title>
                <h6> {vet.specialization}</h6>
              </Card.Title>
              <Card.Text className="review rating-stars">
                Рейтинг: {vet.averageRating.toFixed(1)}{" "}
                <RatingStars rating={vet.averageRating} /> ({vet.totalReviewers}
                )
              </Card.Text>

              <Card.Text className="review rating-stars">
                Адрес проведения приема: {vet.clinicAddress} <br />
                Стоимость приема: {vet.appointmentCost} ₽
              </Card.Text>
              <hr />
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
            <div className="accordion-link-wrapper">
              <Link
                to={`/Veterinarian/${vet.id}/veterinarian`}
                className="link-2"
              >
                Информация о ветеринаре {vet.firstName} и отзывы клиентов
              </Link>{" "}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default VeterinarianCard;
