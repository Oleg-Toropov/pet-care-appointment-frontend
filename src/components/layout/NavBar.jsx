import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const NavBar = () => {
  const { userId } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>
        <Navbar.Brand to={"/"} as={Link} className="nav-home">
          uniPetcare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to={"/doctors"} as={Link}>
              Познакомьтесь с нашими ветеринарами
            </Nav.Link>
            <Nav.Link to={"/admin-dashboard"} as={Link}>
              Администратор
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title="Вход и регистрация"
              id="basic-nav-dropdown"
              show={showDropdown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavDropdown.Item to={"/register-user"} as={Link}>
                Зарегистрироваться
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item to={"/user-dashboard"} as={Link}>
                Войти
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                to={`/user-dashboard/${userId}/my-dashboard`}
                as={Link}
              >
                Мой профиль
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item to={"/admin-dashboard"} as={Link}>
                Панель администратора
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item to={"/logout"} as={Link}>
                Выйти
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
