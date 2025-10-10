<<<<<<< HEAD
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import Router from './routes/Router.jsx';
=======
import { createRoot } from 'react-dom/client';
import './index.css';
import Router from './routes/Router.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';
>>>>>>> c24d33c (251010 header 추가)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>
<<<<<<< HEAD
); 
=======
)
>>>>>>> c24d33c (251010 header 추가)
