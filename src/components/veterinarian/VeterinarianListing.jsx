import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VeterinarianCard from "./VeterinarianCard";
import { getVeterinarians } from "./VeterinarianService";
import VeterinarianSearch from "./VeterinarianSearch";
import UseMessageAlerts from "../hooks/UseMessageAlerts";

const VeterinarianListing = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [allVeterinarians, setAllVeterinarians] = useState([]);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  useEffect(() => {
    getVeterinarians()
      .then((data) => {
        setVeterinarians(data.data);
        setAllVeterinarians(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      });
  }, []);

  if (veterinarians.length === 0) {
    return <p>На данный момент ветеринары не найдены</p>;
  }

  const handleSearchResult = (veterinarians) => {
    if (veterinarians === null) {
      setVeterinarians(allVeterinarians);
      // setShowErrorAlert(false);
    } else if (Array.isArray(veterinarians) && veterinarians.length > 0) {
      setVeterinarians(veterinarians);
    } else {
      setVeterinarians([]);
    }

    // setShowErrorAlert(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <h2 className="text-center mb-4 mt-4">
          Познакомьтесь с нашими ветеринарами
        </h2>
      </Row>

      <Row className="justify-content-center">
        <Col md={4}>
          <VeterinarianSearch onSearchResult={handleSearchResult} />
        </Col>

        <Col md={7}>
          {veterinarians.map((vet, index) => (
            <VeterinarianCard key={index} vet={vet} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default VeterinarianListing;
