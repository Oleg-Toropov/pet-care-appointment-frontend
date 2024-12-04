import home1 from "../../assets/images/home1.jpg";
import home2 from "../../assets/images/home2.jpg";
import { Card, Button, Row, ListGroup, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faSyringe,
  faTooth,
  faHeartbeat,
  faMicroscope,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <Container className="home-container mt-5">
      <Row className="g-4">
        <Col md={6}>
          <Card
            as={motion.div}
            whileHover={{ y: -10 }}
            className="shadow-sm border-0 rounded-lg"
          >
            <Card.Img
              variant="top"
              src={home1}
              alt="About Us"
              className="hero-image"
              style={{ objectFit: "cover", height: "250px" }}
            />
            <Card.Body>
              <h2 className="text-highlight">Кто мы такие</h2>
              <Card.Title>
                Комплексный уход за вашими пушистыми друзьями
              </Card.Title>
              <Card.Text className="text-muted">
                В Doctor Aibolit мы уверены, что каждый питомец заслуживает
                лучшего. Наша команда преданных профессионалов стремится
                обеспечить здоровье и счастье вашего питомца с помощью
                комплексных ветеринарных услуг.
              </Card.Text>
              <Button as={Link} to="/doctors" className="custom-button">
                Познакомьтесь с нашими ветеринарами
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            as={motion.div}
            whileHover={{ y: -10 }}
            className="shadow-sm border-0 rounded-lg"
          >
            <Card.Img
              variant="top"
              src={home2}
              alt="Our Services"
              className="hero-image"
              style={{ objectFit: "cover", height: "250px" }}
            />
            <Card.Body>
              <h2 className="text-highlight">Наши услуги</h2>
              <Card.Title>Что мы предлагаем:</Card.Title>
              <ListGroup className="mb-3">
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faPaw}
                    className="me-2 text-highlight"
                  />
                  Ветеринарные осмотры
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faSyringe}
                    className="me-2 text-highlight"
                  />
                  Вакцинация животных
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faTooth}
                    className="me-2 text-highlight"
                  />
                  Стоматологический уход
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    className="me-2 text-highlight"
                  />
                  Экстренные операции
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faMicroscope}
                    className="me-2 text-highlight"
                  />
                  Имплантация микрочипов
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faEllipsisH}
                    className="me-2 text-highlight"
                  />
                  И многое другое...
                </ListGroup.Item>
              </ListGroup>
              <Card.Text className="text-muted">
                От плановых осмотров до экстренных операций — наш полный спектр
                услуг гарантирует, что здоровье вашего питомца в надежных руках.
              </Card.Text>
              <Button as={Link} to="/doctors" className="custom-button">
                Записаться на прием
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
