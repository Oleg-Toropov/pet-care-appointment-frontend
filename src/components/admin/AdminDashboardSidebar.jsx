import {
  BsFillHospitalFill,
  BsGrid1X2Fill,
  BsX,
  BsPeopleFill,
  BsCalendar,
} from "react-icons/bs";
import { MdEvent } from "react-icons/md";

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
          <BsFillHospitalFill className="icon-header" /> Doctor Aibolit
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
            <BsGrid1X2Fill className="icon" /> Статистика
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
        <li
          className={`sidebar-list-item ${
            activeTab === "appointments" ? "active" : ""
          }`}
          onClick={() => onNavigate("appointments")}
        >
          <a href="#">
            <BsCalendar className="icon" /> Записи на прием
          </a>
        </li>
        <li
          className={`sidebar-list-item ${
            activeTab === "reviews" ? "active" : ""
          }`}
          onClick={() => onNavigate("reviews")}
        >
          <a href="#">
            <MdEvent className="icon" /> Отзывы
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminDashboardSidebar;
