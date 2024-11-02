import React, { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import AlertMessage from "../common/AlertMessage";
import { Button, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import EditablePetRow from "./EditablePetRow";
import { updatePet, deletePet } from "./PetService";
import { addPetToAppointment } from "../appointment/AppointmentService";

const PetsTable = ({
  pets,
  onPetsUpdate,
  isEditable,
  isPatient,
  appointmentId,
}) => {
  const [editModeId, setEditModeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newPetData, setNewPetData] = useState({
    name: "",
    type: "",
    breed: "",
    color: "",
    age: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditModeId(null);
    setIsAdding(false);
    setNewPetData({ name: "", type: "", breed: "", color: "", age: "" });
  };

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

  const handleEditClick = (petId) => {
    setEditModeId(petId);
  };

  const handleShowDeleteModal = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const handleSaveNewPet = async () => {
    if (
      !newPetData.name ||
      !newPetData.type ||
      !newPetData.breed ||
      !newPetData.color ||
      !newPetData.age
    ) {
      setErrorMessage("Для добавления питомца необходимо заполнить все поля");
      setShowErrorAlert(true);
      return;
    }

    try {
      const response = await addPetToAppointment(appointmentId, {
        ...newPetData,
      });
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.data.message);
      setIsAdding(false);
      setNewPetData({ name: "", type: "", breed: "", color: "", age: "" });
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleDeletePet = async () => {
    if (petToDelete) {
      try {
        const response = await deletePet(petToDelete);
        await onPetsUpdate(appointmentId);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowDeleteModal(false);
        setShowErrorAlert(true);
      }
    }
  };

  const handleSavePetUpdate = async (petId, updatedPet) => {
    if (
      !updatedPet.name ||
      !updatedPet.type ||
      !updatedPet.breed ||
      !updatedPet.color ||
      !updatedPet.age
    ) {
      setErrorMessage("Все поля должны быть заполнены");
      setShowErrorAlert(true);
      return;
    }

    try {
      const response = await updatePet(petId, updatedPet);
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.message);
      setEditModeId(null);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  return (
    <section>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePet}
        itemToDelete="питомца"
      />
      {showErrorAlert && <AlertMessage type="danger" message={errorMessage} />}
      {showSuccessAlert && (
        <AlertMessage type="success" message={successMessage} />
      )}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Кличка</th>
            <th>Тип</th>
            <th>Порода</th>
            <th>Цвет</th>
            <th>Возраст</th>
            {isPatient && <th colSpan={3}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pets) &&
            pets.map((pet, index) =>
              editModeId === pet.id ? (
                <EditablePetRow
                  key={index}
                  pet={pet}
                  index={index}
                  onSave={handleSavePetUpdate}
                  onCancel={handleCancel}
                />
              ) : (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.type}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.color}</td>
                  <td>{pet.age}</td>

                  {isPatient && (
                    <React.Fragment>
                      <td>
                        <Button
                          className="btn btn-sm btn-warning"
                          disabled={!isEditable}
                          onClick={() => handleEditClick(pet.id)}
                        >
                          <BsPencilFill />
                        </Button>
                      </td>

                      <td>
                        <Button
                          className="btn btn-sm btn-danger"
                          disabled={!isEditable}
                          onClick={() => handleShowDeleteModal(pet.id)}
                        >
                          <BsTrashFill />
                        </Button>
                      </td>
                    </React.Fragment>
                  )}
                </tr>
              )
            )}

          {isAdding && (
            <EditablePetRow
              pet={newPetData}
              onSave={handleSaveNewPet}
              onCancel={handleCancel}
              isNew
              handleInputChange={handleInputChange}
            />
          )}
        </tbody>
      </Table>
      {isPatient && isEditable && (
        <Button
          className="btn btn-sm btn-primary mt-2"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Добавить питомца
        </Button>
      )}
    </section>
  );
};

export default PetsTable;
