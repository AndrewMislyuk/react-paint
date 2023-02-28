import React from "react";
import toolState from "../store/toolState";

const SettingsBar = () => {
  return (
    <div className="settings-bar">
      <label htmlFor="line-width">Line Width</label>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          toolState.setLineWidth(Number(e.target.value))
        }
        style={{ margin: "0 10px" }}
        id="line-width"
        type="number"
        defaultValue={1}
        min={1}
        max={50}
      />

      <label htmlFor="stroke-color">Stroke Color</label>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          toolState.setStrokeColor(e.target.value)
        }
        style={{ margin: "0 10px" }}
        id="stroke-color"
        type="color"
      />
    </div>
  );
};

export default SettingsBar;
