import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Importer from "./pages/Importer.jsx"
import Roles from "./pages/Roles";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import { BrowserRouter } from "react-router-dom";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
