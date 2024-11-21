import { useState } from "react";
import ActionButtons from "./ActionButtons";
import ProcessSpinner from "../common/ProcessSpinner";

const VeterinarianActions = ({
  onApprove,
  onDecline,
  isDisabled,
  appointment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const handleActionClick = async (actionType) => {
    setIsProcessing(true);
    setProcessingAction(actionType);

    const action = actionType === "Approve" ? onApprove : onDecline;

    try {
      await action(appointment.id);
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  return (
    <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
      <ActionButtons
        variant={"success"}
        onClick={() => handleActionClick("Approve")}
        disabled={isDisabled || isProcessing}
      >
        {isProcessing && processingAction === "Approve" ? (
          <ProcessSpinner message="Подтверждение приема..." />
        ) : (
          "Подтвердить прием"
        )}
      </ActionButtons>

      <ActionButtons
        variant={"secondary"}
        onClick={() => handleActionClick("Decline")}
        disabled={isDisabled || isProcessing}
      >
        {isProcessing && processingAction === "Decline" ? (
          <ProcessSpinner message="Отказ от приема..." />
        ) : (
          "Отказаться от приема"
        )}
      </ActionButtons>
    </section>
  );
};

export default VeterinarianActions;
