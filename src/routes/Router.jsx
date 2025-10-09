import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
}

export default Router;