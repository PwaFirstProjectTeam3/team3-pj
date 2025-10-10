import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LineList from "../components/lines/LineList.jsx";
import SearchIndex from "../components/searchs/SearchIndex.jsx";
// import RouteSearch from "../components/searchs/RouteSearch.jsx";
import Evacuation from '../components/evacuations/EvacuationIndex.jsx';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LineList />
      },
      {
        path: '/stations',
        element: <SearchIndex />
      },
      {
        path: '/evacuation',
        element: <Evacuation />
      }
    ]
  }
])

function Router() {
  return <RouterProvider router={router} />
}

export default Router;