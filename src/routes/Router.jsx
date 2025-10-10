import { createBrowserRouter, RouterProvider } from "react-router-dom";
<<<<<<< HEAD
import Line1 from "../components/lines/Line1.jsx";
import App from "../App.jsx";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: '/line1',
                element: <Line1 />,
            },
        ]
    }
]); 

function Router() {
    return <RouterProvider router={router} />
=======
import App from "../App.jsx";
import LineList from "../components/lines/LineList.jsx";
import RouteSearch from "../components/searchs/RouteSearch.jsx";
import Evacuation from '../components/evacuations/EvacuationIndex.jsx';
import LinesDetail from "../components/linesdetail/LinesDetail.jsx";
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
        element: <RouteSearch />
      },
      {
        path: '/evacuation',
        element: <Evacuation />
      },
      {
        path: '/linesdetail',
        element: <LinesDetail />,
        handle: { hideParent: true }
      },
      {
        path: '/details/:id',
        element: <Detail />
      },
    ]
  }
])


function Router() {
  return <RouterProvider router={router} />
>>>>>>> c24d33c (251010 header 추가)
}

export default Router;