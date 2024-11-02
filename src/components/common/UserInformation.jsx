import React from "react";

const UserInformation = ({ userType, appointment }) => {
  return (
    <div className="mt-2 mb-2" style={{ backgroundColor: "whiteSmoke" }}>
      <h5 className="mb-3">
        Информация о {userType === "VET" ? "клиенте" : "ветеринаре"}
      </h5>
      {userType === "VET" ? (
        <React.Fragment>
          <p>
            Имя: {appointment.patient.firstName} {appointment.patient.lastName}
          </p>
          <p>Электронная почта: {appointment.patient.email}</p>
          <p>
            Телефон:{" "}
            <span className="text-info">{appointment.patient.phoneNumber}</span>
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>
            Имя: {appointment.veterinarian.firstName}{" "}
            {appointment.veterinarian.lastName}
          </p>
          <p>Специализация: {appointment.veterinarian.specialization}</p>
          <p>Электронная почта: {appointment.veterinarian.email}</p>
          <p>
            Телефон:{" "}
            <span className="text-info">
              {appointment.veterinarian.phoneNumber}
            </span>
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

export default UserInformation;
