import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VeterinarianCard from "./VeterinarianCard";
import { getVeterinariansWithoutDetails } from "./VeterinarianService";
import VeterinarianSearch from "./VeterinarianSearch";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import NoDataAvailable from "../common/NoDataAvailable";
import LoadSpinner from "../common/LoadSpinner";

const VeterinarianListing = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [allVeterinarians, setAllVeterinarians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  useEffect(() => {
    getVeterinariansWithoutDetails()
      .then((data) => {
        setVeterinarians(data.data);
        setAllVeterinarians(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
        setIsLoading(false);
      });
  }, []);

  const handleSearchResult = (veterinarians) => {
    if (veterinarians === null) {
      setVeterinarians(allVeterinarians);
    } else if (Array.isArray(veterinarians) && veterinarians.length > 0) {
      setVeterinarians(veterinarians);
    } else {
      setVeterinarians([]);
    }
  };

  const handleToggle = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <Container>
      {veterinarians && veterinarians.length > 0 ? (
        <React.Fragment>
          <Row className="mb-3">
            <Col xs={12} className="d-block d-md-none mb-3">
              <VeterinarianSearch onSearchResult={handleSearchResult} />
            </Col>
          </Row>

          <Row>
            <Col md={4} className="d-none d-md-block sticky-search">
              <VeterinarianSearch onSearchResult={handleSearchResult} />
            </Col>

            <Col md={8}>
              <h2 className="title-background text-center mb-4 mt-4">
                Ветеринары, готовые принять вас
              </h2>
              {veterinarians.map((vet, index) => (
                <VeterinarianCard
                  key={index}
                  vet={vet}
                  eventKey={index.toString()}
                  activeKey={activeKey}
                  onToggle={handleToggle}
                />
              ))}
            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={"veterinarians data"}
          message={errorMessage}
        />
      )}
    </Container>
  );
};

export default VeterinarianListing;
