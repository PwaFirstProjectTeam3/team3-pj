import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import Main from "../components/Main.jsx";
import RouteSearch from "../components/RouteSearch.jsx";
import Detail from "../components/detail/Detail.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />
      },
      {
        path: '/stations',
        element: <RouteSearch />
      },
      {
        path: '/details/:id',
        element: <Detail />
      }
    ]
  }
])

function Router() {
  return <RouterProvider router={router} />
}

export default Router;