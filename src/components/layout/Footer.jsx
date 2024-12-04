import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-start">
            <h5>Наш адрес</h5>
            <p>г. Москва, ул. Ветеринарная, д. 10</p>
          </Col>
          <Col md={4} className="text-center">
            <h5>Контактная информация</h5>
            <p>Телефон: +7 (495) 123-45-67</p>
            <p>Email: info@doctoraibolit.ru</p>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <h5>Часы работы</h5>
            <p>Пн-Вс: 9:00 - 21:00</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p className="text-muted">
              &copy; {new Date().getFullYear()} Doctor Aibolit. Все права
              защищены.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
