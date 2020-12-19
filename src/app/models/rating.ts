export interface Rating {
  author: string;
  stars: number;
  comment: string;
  mensa: string;
  timestamp: Date;
  id: number;
}
export interface ReviewForm {
  author: string;
  stars: number;
  comment: string;
  mensaId: number;
  id: number;
}
