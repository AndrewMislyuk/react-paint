import Brush from "./Brush";

export default class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string | null) {
    super(canvas, socket, id);
  }

  draw(x: number, y: number) {
    this.ctx!.strokeStyle = "white";
    this.ctx!.lineTo(x, y);
    this.ctx!.stroke();
  }
}
