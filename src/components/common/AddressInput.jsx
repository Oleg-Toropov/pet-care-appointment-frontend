import React from "react";

const AddressInput = ({ user, setUser }) => {
  const handleStreetChange = (e) => {
    const value = e.target.value.replace(/[^а-яА-ЯёЁ\s.-]/g, "");
    setUser((prev) => ({
      ...prev,
      street: value,
    }));
  };

  const handleHouseChange = (e) => {
    const value = e.target.value.replace(/[^а-яА-ЯёЁ\s0-9/-]/g, "");
    setUser((prev) => ({
      ...prev,
      house: value,
    }));
  };

  const formatAddress = () => {
    return `г. Пермь, ул. ${user.street}, ${user.house}`;
  };

  return (
    <div>
      <div className="d-flex gap-2">
        <span className="align-self-center">ул.</span>
        <input
          type="text"
          className="form-control shadow"
          placeholder="Ленина"
          value={user.street || ""}
          onChange={handleStreetChange}
          required
          style={{ width: "70%", height: "38px" }}
        />
        <span className="align-self-center">д.</span>
        <input
          type="text"
          className="form-control shadow"
          placeholder="3 / 2а"
          value={user.house || ""}
          onChange={handleHouseChange}
          required
          style={{ width: "30%", height: "38px" }}
        />
      </div>
      <input type="hidden" name="clinicAddress" value={formatAddress()} />
    </div>
  );
};

export default AddressInput;
