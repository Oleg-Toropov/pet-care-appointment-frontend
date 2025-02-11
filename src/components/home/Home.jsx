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
  faPaw,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <Container className="home-container mt-5">
      <Row className="g-4 align-items-stretch">
        <Col md={6}>
          <Card
            as={motion.div}
            whileHover={{ y: -10 }}
            className="shadow-sm border-0 rounded-lg h-100 d-flex flex-column"
          >
            <Card.Img
              variant="top"
              src={home1}
              alt="About Us"
              className="hero-image"
              style={{ objectFit: "cover", height: "250px" }}
            />

            <Card.Body className="d-flex flex-column">
              <h2 className="text-highlight">Что такое Doctor Aibolit?</h2>
              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Doctor Aibolit – это современный онлайн-сервис, который делает
                заботу о питомцах удобной и доступной. <br />
                Сервис позволяет владельцам животных:
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Сервис позволяет владельцам животных:
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Быстро находить проверенных ветеринаров по специализации,
                рейтингу и отзывам.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Онлайн записываться на прием без необходимости звонков и долгих
                ожиданий.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Оставлять и читать отзывы о ветеринарах, чтобы выбрать лучшего
                специалиста.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon icon={faPaw} className="me-2 text-highlight" />
                Сохранять историю посещений.
              </div>
              <Button as={Link} to="/doctors" className="custom-button mt-auto">
                Найти ветеринара
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            as={motion.div}
            whileHover={{ y: -10 }}
            className="shadow-sm border-0 rounded-lg h-100 d-flex flex-column"
          >
            <Card.Img
              variant="top"
              src={home2}
              alt="How it works"
              className="hero-image"
              style={{ objectFit: "cover", height: "250px" }}
            />

            <Card.Body className="d-flex flex-column">
              <h2 className="text-highlight">Как это работает?</h2>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="me-2 text-highlight"
                />
                Зарегистрируйтесь - создайте учетную запись, чтобы получить
                доступ ко всем возможностям сервиса.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="me-2 text-highlight"
                />
                Найдите ветеринара - выберите специалиста по специализации,
                рейтингу и отзывам.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="me-2 text-highlight"
                />
                Запишитесь на прием – выберите удобное время и запишитесь онлайн
                в пару кликов.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="me-2 text-highlight"
                />
                Оставьте отзыв - помогите другим владельцам животных выбрать
                лучшего специалиста.
              </div>

              <div className="mb-3">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="me-2 text-highlight"
                />
                Город обслуживания - сервис доступен только в городе{" "}
                <strong>Пермь</strong>.
              </div>

              <Button
                as={Link}
                to="/register-user"
                className="custom-button mt-auto"
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
