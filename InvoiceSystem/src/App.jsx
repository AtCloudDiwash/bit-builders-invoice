import {useRoutes} from "react-router-dom";
import NewInvoice from "./Pages/NewInvoice";
import Admin from "./Pages/Admin";
import ErrorPage from "./Pages/ErrorPage";
import SalesHistory from "./Pages/SalesHistory";
import Main from "./Pages/Main";

function App() {

  return useRoutes([
    {
      path: "/",
      element: <Main/>
    },
    {
      path: "/new",
      element: <NewInvoice/>
    },
    {
      path: "/sales",
      element: <SalesHistory/>
    },
    {
      path: "/admin",
      element: <Admin/>
    },
    {
      path: "*",
      element: <ErrorPage/>
    }
  ]);
}

export default App
