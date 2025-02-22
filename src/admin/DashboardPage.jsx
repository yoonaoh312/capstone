import React, { useState } from "react";
import FocusZone from "../components/FocusZone/FocusZone";  

const DashboardPage = () => {
  const [pose, setPose] = useState(null);

  return (
    <div>
      <h2>📊 Focus Tracking Dashboard</h2>
      <FocusZone pose={pose} />
    </div>
  );
};

export default DashboardPage;
