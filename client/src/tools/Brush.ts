import { DrawData } from "../model/DrawData";
import Tool from "./Tool";

export default class Brush extends Tool {
  private mouseDown: boolean = false;

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
          type: "finish",
        },
      } as DrawData)
    );
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(
      e.pageX - (e.target as HTMLElement).offsetLeft,
      e.pageY - (e.target as HTMLElement).offsetTop
    );
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      // this.draw(
      //   e.pageX - (e.target as HTMLElement).offsetLeft,
      //   e.pageY - (e.target as HTMLElement).offsetTop
      // );

      this.socket?.send(
        JSON.stringify({
          method: "draw",
          id: this.id,
          figure: {
            type: "brush",
            x: e.pageX - (e.target as HTMLElement).offsetLeft,
            y: e.pageY - (e.target as HTMLElement).offsetTop,
          },
        } as DrawData)
      );
    }
  }

  static draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
