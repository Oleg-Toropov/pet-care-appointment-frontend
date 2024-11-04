import React from "react";
import { Button, InputGroup, Form, Container, Row, Col } from "react-bootstrap";

const UserFilter = ({
  label,
  additionalText,
  values = [],
  selectedValue,
  onSelectedValue,
  onClearFilters,
}) => {
  return (
    <InputGroup className="mb-2">
      <InputGroup.Text> {label}</InputGroup.Text>
      <Form.Select
        className="form-control"
        value={selectedValue}
        onChange={(e) => onSelectedValue(e.target.value)}
      >
        <option value="">{additionalText}</option>
        {values.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </Form.Select>
      <Button variant="secondary" onClick={onClearFilters}>
        Сбросить
      </Button>
    </InputGroup>
  );
};

export default UserFilter;