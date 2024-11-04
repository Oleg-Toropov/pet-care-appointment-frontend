import {
  BsFillHospitalFill,
  BsGrid1X2Fill,
  BsX,
  BsPeopleFill,
} from "react-icons/bs";

const AdminDashboardSidebar = ({
  openSidebarToggle,
  OpenSidebar,
  onNavigate,
  activeTab,
}) => {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsFillHospitalFill className="icon-header" /> uniPetcare
        </div>
        <span className="icon icon-close" onClick={OpenSidebar}>
          <BsX />
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className={`sidebar-list-item ${
            activeTab === "overview" ? "active" : ""
          }`}
          onClick={() => onNavigate("overview")}
        >
          <a href="#">
            <BsGrid1X2Fill className="icon" /> Панель управления
          </a>
        </li>

        <li
          className={`sidebar-list-item ${
            activeTab === "veterinarians" ? "active" : ""
          }`}
          onClick={() => onNavigate("veterinarians")}
        >
          <a href="#">
            <BsPeopleFill className="icon" /> Ветеринары
          </a>
        </li>

        <li
          className={`sidebar-list-item ${
            activeTab === "patients" ? "active" : ""
          }`}
          onClick={() => onNavigate("patients")}
        >
          <a href="#">
            <BsPeopleFill className="icon" /> Клиенты
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminDashboardSidebar;
