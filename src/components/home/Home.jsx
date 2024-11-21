import home1 from "../../assets/images/home1.jpg";
import home2 from "../../assets/images/home2.jpg";
import { Card, Button, Row, ListGroup, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="home-container mt-5">
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Img
              variant="top"
              src={home1}
              alt="About Us"
              className="hero-image"
            />
            <Card.Body>
              <h2 className="text-info">Кто мы такие</h2>
              <Card.Title>
                Комплексный уход за вашими пушистыми друзьями
              </Card.Title>
              <Card.Text>
                В Doctor Aibolit мы уверены, что каждый питомец заслуживает
                лучшего. Наша команда преданных профессионалов здесь, чтобы
                обеспечить здоровье и счастье вашего питомца с помощью
                комплексных ветеринарных услуг. Обладая десятилетиями
                совместного опыта, наши ветеринары и персонал стремятся
                предоставлять индивидуальный уход, учитывая уникальные
                потребности каждого питомца.
              </Card.Text>
              <Card.Text>
                Мы предлагаем широкий спектр услуг: от профилактического ухода и
                плановых осмотров до сложных хирургических процедур и неотложной
                помощи. Наше современное медицинское учреждение оснащено
                новейшими ветеринарными технологиями, что позволяет нам
                предоставлять высококачественную помощь с точностью и
                состраданием. Мы предлагаем широкий спектр услуг: от
                профилактического ухода и плановых осмотров до сложных
                хирургических процедур и неотложной помощи. Наше современное
                медицинское учреждение оснащено новейшими ветеринарными
                технологиями, что позволяет нам предоставлять высококачественную
                помощь с точностью и состраданием. Наше современное медицинское
                учреждение оснащено новейшими ветеринарными технологиями, что
                позволяет нам предоставлять высококачественную помощь.
              </Card.Text>
              <Button as={Link} to="/doctors" variant="outline-info">
                Познакомьтесь с нашими ветеринарами
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="service-card">
            <Card.Img
              variant="top"
              src={home2}
              alt="About Us"
              className="hero-image"
            />
            <Card.Body>
              <h2 className="text-info">Наши услуги</h2>
              <Card.Title>Что мы предлагаем:</Card.Title>
              <ListGroup className="services-list">
                <ListGroup.Item>Ветеринарные осмотры</ListGroup.Item>
                <ListGroup.Item>Экстренные операции</ListGroup.Item>
                <ListGroup.Item>Вакцинация животных</ListGroup.Item>
                <ListGroup.Item>Стоматологический уход</ListGroup.Item>
                <ListGroup.Item>Стерилизация и кастрация</ListGroup.Item>
                <ListGroup.Item>Имплантация микрочипов</ListGroup.Item>
                <ListGroup.Item>И многое другое...</ListGroup.Item>
              </ListGroup>
              <Card.Text className="mt-3">
                От плановых осмотров до экстренных операций — наш полный спектр
                ветеринарных услуг гарантирует, что здоровье вашего питомца в
                надежных руках.
              </Card.Text>
              <Button as={Link} to="/doctors" variant="outline-info">
                Познакомьтесь с нашими ветеринарами
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
