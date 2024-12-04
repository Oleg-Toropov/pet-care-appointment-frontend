import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import NavBar from "./NavBar";
import Footer from "./Footer";

const RootLayout = () => {
  return (
    <main className="d-flex flex-column min-vh-100">
      <NavBar />
      <BackgroundImageSlider />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default RootLayout;
