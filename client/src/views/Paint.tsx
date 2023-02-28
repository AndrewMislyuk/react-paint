import React from "react";
import Canvas from "../components/Canvas";
import SettingsBar from "../components/SettingsBar";
import Toolbar from "../components/Toolbar";

const Paint = () => {
  return (
    <div>
      <Toolbar />
      <SettingsBar />
      <Canvas />
    </div>
  );
};

export default Paint;
