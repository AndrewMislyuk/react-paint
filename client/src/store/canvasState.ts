import { makeAutoObservable } from "mobx";

class CanvasState {
  canvas: HTMLCanvasElement | null = null;
  socket: WebSocket | null = null;
  sessionId: string | null = null;
  private undoList: string[] = [];
  private redoList: string[] = [];
  username: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  }

  pushToUndo(data: string) {
    this.undoList.push(data);
  }

  pushToRedo(data: string) {
    this.redoList.push(data);
  }

  undo() {
    const ctx = this.canvas!.getContext("2d");

    if (!this.undoList.length) {
      ctx?.clearRect(
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      return;
    }

    const dataUrl = this.undoList.pop();
    this.pushToRedo(this.canvas?.toDataURL() as string);
    const img = new Image();
    img.src = dataUrl as string;
    img.onload = () => {
      ctx?.clearRect(
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      ctx?.drawImage(
        img,
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
    };
  }

  redo() {
    const ctx = this.canvas!.getContext("2d");

    if (!this.redoList.length) {
      return;
    }

    const dataUrl = this.redoList.pop();
    this.pushToUndo(this.canvas?.toDataURL() as string);
    const img = new Image();
    img.src = dataUrl as string;
    img.onload = () => {
      ctx?.clearRect(
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
      ctx?.drawImage(
        img,
        0,
        0,
        Number(this.canvas?.width),
        Number(this.canvas?.height)
      );
    };
  }
}

export default new CanvasState();
