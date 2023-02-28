import { DrawData } from "../model/DrawData";
import Tool from "./Tool";

export default class Rect extends Tool {
  private mouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private width: number = 0;
  private height: number = 0;
  private saved: string = "";

  constructor(
    canvas: HTMLCanvasElement | null,
    socket: WebSocket | null,
    id: string | null
  ) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas!.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas!.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas!.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
    this.socket?.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
          color: this.ctx?.fillStyle,
        },
      } as DrawData)
    );
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.ctx?.beginPath();
    this.startX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.startY = e.pageY - (e.target as HTMLElement).offsetTop;
    this.saved = this.canvas!.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      const currentX = e.pageX - (e.target as HTMLElement).offsetLeft;
      const currentY = e.pageY - (e.target as HTMLElement).offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;

      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx!.clearRect(
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      this.ctx?.drawImage(
        img,
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      this.ctx?.beginPath();
      this.ctx?.rect(x, y, w, h);
      this.ctx?.fill();
      this.ctx?.stroke();
    };
  }

  static staticDraw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
}
