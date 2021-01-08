export class Rating {
  constructor(
    public author?: string,
    public stars?: number,
    public comment?: string,
    public mensa?: string,
    public timestamp?: Date,
    public id?: number
  ) {}
}
export interface ReviewForm {
  author: string;
  stars: number;
  comment: string;
  mensaId: number;
  id: number;
}
