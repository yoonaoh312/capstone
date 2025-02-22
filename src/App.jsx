import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminPanel from "./admin/AdminPanel/AdminPanel";
import "./App.scss";

const App = () => {
  return (
    <Router>
      <AdminPanel />
    </Router>
  );
};

export default App;
