import {useRoutes} from "react-router-dom";
import Admin from "./Pages/Admin";
import ErrorPage from "./Pages/ErrorPage";
import Main from "./Pages/Main";

function App() {

  return useRoutes([
    {
      path: "/",
      element: <Main/>
    },
    {
      path: "/new",
      element: <Main currentPage="newInvoice"/>
    },
    {
      path: "/sales",
      element: <Main currentPage="salesHistory"/>
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
