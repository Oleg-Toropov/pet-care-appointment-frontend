import { useState } from "react";
import { BsPersonFill, BsLockFill } from "react-icons/bs";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Вход в личный кабинет
              </Card.Title>
              <Form>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Логин</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsPersonFill />
                    </InputGroup.Text>

                    <Form.Control
                      type="text"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      placeholder="email"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Пароль</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsLockFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100"
                >
                  Войти
                </Button>
              </Form>
              <div className="text-center mt-2">
                У вас еще нет учетной записи?{" "}
                <Link to={"/register-user"} style={{ textDecoration: "none" }}>
                  Зарегистрируйтесь здесь
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
