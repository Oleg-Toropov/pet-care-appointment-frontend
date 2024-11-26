import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../auth/AuthService";

const NavBar = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const userRoles = localStorage.getItem("userRoles") || [];
  const userId = localStorage.getItem("userId") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>
        <Navbar.Brand to={"/"} as={Link} className="nav-home">
          Doctor Aibolit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to={"/doctors"} as={Link}>
              Познакомьтесь с нашими ветеринарами
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={isLoggedIn ? `${userEmail}` : "Личный кабинет"}
              id="basic-nav-dropdown"
            >
              {!isLoggedIn ? (
                <React.Fragment>
                  <NavDropdown.Item to={"/register-user"} as={Link}>
                    Зарегистрироваться
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/login"} as={Link}>
                    Войти
                  </NavDropdown.Item>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    to={`/user-dashboard/${userId}/my-dashboard`}
                    as={Link}
                  >
                    Мой профиль
                  </NavDropdown.Item>
                  {userRoles.includes("ROLE_ADMIN") && (
                    <React.Fragment>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        to={`/admin-dashboard/${userId}/admin-dashboard`}
                        as={Link}
                      >
                        Панель администратора
                      </NavDropdown.Item>
                    </React.Fragment>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"#"} onClick={handleLogout}>
                    Выйти
                  </NavDropdown.Item>
                </React.Fragment>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
