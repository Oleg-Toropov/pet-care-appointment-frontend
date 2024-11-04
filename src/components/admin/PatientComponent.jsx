import React, { useState, useEffect } from "react";
import {
  Table,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getPatients } from "../patient/PatientService";
import Paginator from "../common/Paginator";

const PatientComponent = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
          patient.lastName.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main>
      <Row>
        <Col>
          {showErrorAlert && (
            <AlertMessage type="danger" message={errorMessage} />
          )}
          {showSuccessAlert && (
            <AlertMessage type="success" message={successMessage} />
          )}
        </Col>
      </Row>
      <Row className="mb-2">
        <h5 className="mb-4">Список клиентов</h5>
        <Col md={5}>
          <FormControl
            type="text"
            placeholder="Поиск по имени или фамилии"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <button onClick={handleClearSearch} className="btn btn-secondary">
            Очистить
          </button>
        </Col>
      </Row>

      <Table bordered hover striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Электронная почта</th>
            <th>Телефон</th>
            <th>Пол</th>
            <th>Дата регистрации</th>
            <th colSpan={4}>Действия</th>
          </tr>
        </thead>

        <tbody>
          {currentPatients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.id}</td>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{patient.email}</td>
              <td>{patient.phoneNumber}</td>
              <td> {patient.gender === "Male" ? "Мужской" : "Женский"}</td>
              <td>{new Date(patient.createdAt).toLocaleDateString("ru-RU")}</td>
              <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${index}`}>
                      Посмотреть информацию о клиенте
                    </Tooltip>
                  }
                >
                  <Link
                    to={`/user-dashboard/${patient.id}/my-dashboard`}
                    className="text-info"
                  >
                    <BsEyeFill />
                  </Link>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalItems={filteredPatients.length}
        paginate={setCurrentPage}
        itemsPerPage={patientsPerPage}
      />
    </main>
  );
};

export default PatientComponent;
