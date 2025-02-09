import home1 from "../../assets/images/home1.jpg";
import home2 from "../../assets/images/home2.jpg";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSearch,
  faCalendarCheck,
  faCommentDots,
  faLaptopMedical,
  faMapMarkerAlt,
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
              <h2 className="text-highlight">Что такое Doctor Aibolit?</h2>
              <FontAwesomeIcon
                icon={faLaptopMedical}
                className="me-2 text-highlight"
              />
              <strong className="text-highlight">
                Онлайн-сервис для записи к ветеринарам
              </strong>{" "}
              <div className="mb-3">
                Doctor Aibolit – это онлайн-сервис, который помогает владельцам
                животных легко находить проверенных ветеринаров и записываться
                на прием онлайн.
              </div>
              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="me-2 text-highlight"
                />
                <strong className="text-highlight">Город обслуживания</strong> –
                сервис доступен только в городе <strong>Пермь</strong>.
              </div>
              <Button as={Link} to="/doctors" className="custom-button">
                Найти ветеринара
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
              alt="How it works"
              className="hero-image"
              style={{ objectFit: "cover", height: "250px" }}
            />
            <Card.Body>
              <h2 className="text-highlight">Как это работает?</h2>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="me-2 text-highlight"
                />
                <strong className="text-highlight">Зарегистрируйтесь</strong> –
                создайте учетную запись, чтобы получить доступ ко всем
                возможностям сервиса.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="me-2 text-highlight"
                />
                <strong className="text-highlight">Найдите ветеринара</strong> –
                выберите специалиста по специализации, рейтингу и отзывам.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="me-2 text-highlight"
                />
                <strong className="text-highlight">Запишитесь на прием</strong>{" "}
                – выберите удобное время и запишитесь онлайн в пару кликов.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="me-2 text-highlight"
                />
                <strong className="text-highlight">Оставьте отзыв</strong> –
                помогите другим владельцам животных выбрать лучшего специалиста.
              </div>

              <Button
                as={Link}
                to="/register-user"
                className="custom-button me-2"
              >
                Зарегистрироваться
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
