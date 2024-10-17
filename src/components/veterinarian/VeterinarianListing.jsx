import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VeterinarianCard from "./VeterinarianCard";
import { getVeterinarians } from "./VeterinarianService";

const VeterinarianListing = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getVeterinarians()
      .then((data) => {
        setVeterinarians(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  if (veterinarians.length === 0) {
    return <p>No veterinarians found at this time</p>;
  }

  return (
    <Row>
      <h6>Meet Our Veterinarians</h6>
      <Col>
        <Container>
          <Row>
            <h5>The search goes here</h5>
          </Row>
        </Container>

        <Col>
          <Container>
            <Row>
              {veterinarians.map((vet, index) => (
                <VeterinarianCard key={index} vet={vet} />
              ))}
            </Row>
          </Container>
        </Col>
      </Col>
    </Row>
  );
};

export default VeterinarianListing;
