import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { React } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './Login.jsx';
import ChatInterface from './ChatInterface.jsx';
import Platform from './Platform.jsx';
import { Provider } from './Context.jsx';

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//     <App />
//   // </StrictMode>,
// )
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Provider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Platform />} />
        {/* <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/dashboard/student" element={<Student />} />
        <Route
          path="/dashboard/admin/feedbacks/:file_title"
          element={<Feedback />}
        />
        <Route path="/dashboard/admin/students" element={<AdminUtils2 />} /> */}
      </Routes>
    </Provider>
  </BrowserRouter>
);

