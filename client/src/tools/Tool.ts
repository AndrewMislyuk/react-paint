export default class Tool {
  canvas: HTMLCanvasElement | null = null;
  socket: WebSocket | null = null;
  id: string | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string | null
  ) {
    this.canvas = canvas;
    this.socket = socket;
    this.id = id;
    this.ctx = canvas?.getContext("2d") ?? null;
    this.destroyEvents();
  }

  set fillColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx!.fillStyle = color;
  }

  set strokeColor(color: string | CanvasGradient | CanvasPattern) {
    this.ctx!.strokeStyle = color;
  }

  set lineWidth(width: number) {
    this.ctx!.lineWidth = width;
  }

  destroyEvents() {
    this.canvas!.onmousemove = null;
    this.canvas!.onmousedown = null;
    this.canvas!.onmouseup = null;
  }
}
