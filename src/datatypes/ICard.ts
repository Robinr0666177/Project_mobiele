export interface ICard {
  id?: number;
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  card_number: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type_id: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set_id?: number;
  description?: string;
  cardState?: string;
  value?: number;
  amount?: number;
  image?: string;
}
