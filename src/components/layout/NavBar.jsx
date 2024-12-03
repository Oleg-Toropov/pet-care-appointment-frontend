import { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../auth/AuthService";
import { getUserPhoto } from "../user/UserService";
import placeholder from "../../assets/images/placeholder.jpg";

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const userId = localStorage.getItem("userId") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const [photoUrl, setPhotoUrl] = useState(placeholder);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        if (isLoggedIn && userId) {
          const token = localStorage.getItem("authToken");
          const photo = await getUserPhoto(userId, token);
          setPhotoUrl(photo || placeholder);
        }
      } catch (error) {
        console.error("Ошибка загрузки фото пользователя:", error);
        setPhotoUrl(placeholder);
      }
    };

    fetchUserPhoto();
  }, [isLoggedIn, userId]);

  const handleLogout = () => {
    logout();
    setPhotoUrl(placeholder);
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
              title={
                <div className="dropdown-title-container">
                  <img
                    src={photoUrl || placeholder}
                    alt="User Avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <span>{userEmail}</span>
                  <span className="custom-dropdown-toggle"></span>
                </div>
              }
              id="basic-nav-dropdown"
            >
              {!isLoggedIn ? (
                <>
                  <NavDropdown.Item to={"/register-user"} as={Link}>
                    Зарегистрироваться
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/login"} as={Link}>
                    Войти
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    to={`/user-dashboard/${userId}/my-dashboard`}
                    as={Link}
                  >
                    Мой профиль
                  </NavDropdown.Item>
                  {userRoles.includes("ROLE_ADMIN") && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        to={`/admin-dashboard/${userId}/admin-dashboard`}
                        as={Link}
                      >
                        Панель администратора
                      </NavDropdown.Item>
                    </>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"#"} onClick={handleLogout}>
                    Выйти
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
