import Tool from "./Tool";

export default class Line extends Tool {
  private mouseDown: boolean = false;
  private currentX: number = 0;
  private currentY: number = 0;
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
    this.canvas!.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas!.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas!.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.currentX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.currentY = e.pageY - (e.target as HTMLElement).offsetTop;
    this.ctx?.beginPath();
    this.ctx?.moveTo(this.currentX, this.currentY);
    this.saved = this.canvas!.toDataURL();
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      this.draw(
        e.pageX - (e.target as HTMLElement).offsetLeft,
        e.pageY - (e.target as HTMLElement).offsetTop
      );
    }
  }

  draw(x: number, y: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async () => {
      this.ctx?.clearRect(
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
      this.ctx?.moveTo(this.currentX, this.currentY);
      this.ctx?.lineTo(x, y);
      this.ctx?.stroke();
    };
  }
}
