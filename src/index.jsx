import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Popup from "./components/popup/Popup";
import Redeem from "./components/redeem/Redeem";
import Success from "./components/success/Success";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Popup />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
