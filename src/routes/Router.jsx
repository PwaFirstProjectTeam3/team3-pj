import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LineList from "../components/lines/LineList.jsx";
import SearchIndex from "../components/searchs/SearchIndex.jsx";
import Evacuation from '../components/evacuations/EvacuationIndex.jsx';
import Detail from "../components/detail/Detail.jsx";

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