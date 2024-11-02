import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import AppointmentUpdateModal from "../modals/AppointmentUpdateModal";

const PatientActions = ({ onCancel, onUpdate, isDisabled, appointment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleActionClick = (actionType) => {
    setIsProcessing(true);
    if (actionType === "Update") {
      setShowUpdateModal(true);
    } else {
      onCancel(appointment.id);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    setIsProcessing(false);
    await onUpdate(updatedAppointment);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <React.Fragment>
      <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
        <ActionButtons
          title={"Изменить запись на прием"}
          variant={"warning"}
          onClick={() => handleActionClick("Update")}
          disabled={isDisabled}
        />
        <ActionButtons
          title={"Отменить запись на прием"}
          variant={"danger"}
          onClick={() => onCancel(appointment.id)}
          disabled={isDisabled}
        />
      </section>

      {showUpdateModal && (
        <AppointmentUpdateModal
          show={showUpdateModal}
          appointment={appointment}
          handleClose={handleCloseModal}
          handleUpdate={handleUpdateAppointment}
        />
      )}
    </React.Fragment>
  );
};

export default PatientActions;
