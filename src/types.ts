export type Place = 'todos' | 'casa' | 'calle';

export type Category = 
  | 'Movimiento'
  | 'Equilibrio'
  | 'Risas'
  | 'Teatro'
  | 'Ingenio'
  | 'Mente'
  | 'Calle'
  | 'Casa'
  | 'Coordinación'
  | 'Control'
  | 'Cariño'
  | 'Creatividad'
  | 'Celebración'
  | 'Fuerza'
  | 'Agilidad'
  | 'Flexibilidad'
  | 'Atención'
  | 'Motivación';

export interface Reto {
  id: string;
  title: string;
  desc: string;
  cat: Category;
  place: Place;
  emoji: string;
  timeSeconds?: number; // Tiempo requerido en segundos para este reto (si aplica)
}

export interface Player {
  id: number;
  name: string;
  avatar: string; // Emoji o data URL base64
  isCustomImg: boolean;
  score: number;
}
