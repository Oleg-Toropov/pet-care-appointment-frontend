import { Container, Row, Form, Col, InputGroup, Button } from "react-bootstrap";
import { formatAppointmentStatus } from "../utils/utilities";

const AppointmentFilter = ({
  statuses = [],
  selectedStatus,
  onSelectStatus,
  onClearFilters,
}) => {
  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12} md={6}>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="statusFilter">
                Фильтр приемов по статусу:
              </Form.Label>
              <InputGroup>
                <Form.Select
                  id="statusFilter"
                  value={selectedStatus}
                  onChange={(e) => onSelectStatus(e.target.value)}
                >
                  <option value="all" disabled hidden>
                    Выберите статус
                  </option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {formatAppointmentStatus(status)}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={onClearFilters}
                >
                  Сбросить
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentFilter;
