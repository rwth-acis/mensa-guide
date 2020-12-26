export class menuItem {
  category: string;
  id: number;
  name: string;
  notes: string[];
  prices: {
    pupils: number;
    students: number;
    employees: number;
    others: number;
  };
}

export class Dish {
  name: string;
  id: number;
  category: string;
}

export interface MensaMenus {
  vita: menuItem[];
  academica: menuItem[];
  ahornstrasse: menuItem[];
}
