import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    setShowFooter(!location.pathname.startsWith("/admin"));
  }, [location.pathname]);

  if (!showFooter) return null;

  return (
    <footer className="custom-footer py-4">
      <Container>
        <Row className="gy-3">
          <Col xs={12} md={6} className="text-center text-md-start">
            <h5>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Контактная информация
            </h5>
            <p>
              Email: <a>support@doctoraibolit.ru</a>
            </p>
            <p>Сервис доступен только для жителей города Пермь.</p>
          </Col>

          <Col xs={12} md={6} className="text-center text-md-end">
            <h5>
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />О сервисе
            </h5>
            <p>Платформа для поиска ветеринаров и онлайн-записи на прием.</p>
            <p>
              Доступен 24/7, график работы ветеринаров зависит от их расписания.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <hr className="my-3" />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col className="text-center">
            <p className="text-muted">
              &copy; {new Date().getFullYear()} Doctor Aibolit. Онлайн-сервис
              для записи к ветеринарам.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
