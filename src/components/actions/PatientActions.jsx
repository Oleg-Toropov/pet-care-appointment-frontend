import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import AppointmentUpdateModal from "../modals/AppointmentUpdateModal";

const PatientActions = ({ onCancel, onUpdate, isDisabled, appointment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleActionClick = async (actionType) => {
    setIsProcessing(true);
    try {
      if (actionType === "Cancel") {
        await onCancel(appointment.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    setIsProcessing(true);
    try {
      await onUpdate(updatedAppointment);
    } finally {
      setIsProcessing(false);
      setShowUpdateModal(false);
    }
  };

  return (
    <React.Fragment>
      <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
        <ActionButtons
          variant={"warning"}
          onClick={() => setShowUpdateModal(true)}
          disabled={isDisabled || isProcessing}
        >
          {isProcessing ? "Обработка..." : "Изменить запись на прием"}
        </ActionButtons>

        <ActionButtons
          variant={"danger"}
          onClick={() => handleActionClick("Cancel")}
          disabled={isDisabled || isProcessing}
        >
          {isProcessing ? "Обработка..." : "Отменить запись на прием"}
        </ActionButtons>
      </section>

      {showUpdateModal && (
        <AppointmentUpdateModal
          show={showUpdateModal}
          appointment={appointment}
          handleClose={() => setShowUpdateModal(false)}
          handleUpdate={handleUpdateAppointment}
        />
      )}
    </React.Fragment>
  );
};

export default PatientActions;
