import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import Router from './routes/Router.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>
); 