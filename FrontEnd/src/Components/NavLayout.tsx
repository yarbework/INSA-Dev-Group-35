import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";


function NavLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        {/* The Outlet component will render the child routes */}
      </main>
      <Footer />
    </>
  );
}

export default NavLayout;
