import { Accordion, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserImage from "../common/UserImage";
import placeholder from "../../assets/images/placeholder.jpg";

const VeterinarianCard = ({ vet }) => {
  return (
    <Col key={vet.id} className="mb-4 xs={12}">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <Link>
                <UserImage
                  userId={vet.id}
                  userPhoto={vet.photo}
                  placeholder={placeholder}
                />
              </Link>
            </div>
            <div className="ms-3">
              <Card.Title className="title">
                {vet.firstName} {vet.lastName}
              </Card.Title>
              <Card.Title>
                <h6> {vet.specialization} </h6>
              </Card.Title>
              <Card.Text className="review rating-stars">
                Рейтинг: звезды
              </Card.Text>
              <Link
                to={`/book-appointment/${vet.id}/new-appointment`}
                className="link"
              >
                Записаться на прием
              </Link>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <Link to={""} className="link-2">
                Посмотреть отзывы клиентов
              </Link>{" "}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default VeterinarianCard;
