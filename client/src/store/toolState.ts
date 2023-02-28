import { makeAutoObservable } from "mobx";
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Rect from "../tools/Rect";

type ToolType = Brush | Rect | Circle | Eraser | Line | null;

class ToolState {
  tool: ToolType = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool: ToolType) {
    this.tool = tool;
  }

  setFillColor(color: string | CanvasGradient | CanvasPattern) {
    this.tool!.fillColor = color;
  }

  setStrokeColor(color: string | CanvasGradient | CanvasPattern) {
    this.tool!.strokeColor = color;
  }

  setLineWidth(width: number) {
    this.tool!.lineWidth = width;
  }
}

export default new ToolState();
