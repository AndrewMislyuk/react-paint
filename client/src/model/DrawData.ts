export enum KindOfFigureEnum {}

export interface Figure {
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
}

export interface DrawData {
  method: string;
  id: string;
  figure: Figure;
}
