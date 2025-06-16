// src/features/scid/data/scid5cv.data.ts

import { genelDegerlendirme_data } from "./genel-degerlendirme.data";
import { moduleA_data } from "./module-a.data";
// import { moduleB_data } from "./module-b.data"; // Gelecekte eklenecek

// ScidQuestion arayüz tanımı aynı kalıyor
export interface ScidQuestion {
  id: string;
  module: string;
  type: 'instruction' | 'question' | 'summary'; // 'summary' tipi eklenebilir
  text: string;
  criteria?: string;
  options?: { label: string; value: any }[];
  skipLogic?: { [key: string]: any };
  notePlaceholder?: string;
}

export const scid5cv_data: ScidQuestion[] = [
  ...genelDegerlendirme_data,
  ...moduleA_data,
  // ...moduleB_data, // Gelecekte eklenecek
];