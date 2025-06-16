// src/features/scid/data/scid5cv.data.ts

import { genelDegerlendirme_data } from "./genel-degerlendirme.data";
import { moduleA_data } from "./module-a.data";
import { moduleB_data } from "./module-b.data";
import { moduleC_data } from "./module-c.data";
import { moduleD_data } from "./module-d.data";
import { moduleE_data } from "./module-e.data";
import { moduleF_data } from "./module-f.data";
import { moduleG_data } from "./module-g.data";
import { moduleH_data } from "./module-h.data";
import { moduleI_data } from "./module-i.data";
import { moduleJ_data } from "./module-j.data"

// Alt soru tipini tanımlayalım
interface SubQuestion {
  id: string;
  text: string;
  criteria: string;
}

// ScidQuestion arayüz tanımı aynı kalıyor
export interface ScidQuestion {
  id: string;
  module: string;
  // 'substance_checklist' ve 'substance_questionnaire' yeni tiplerimiz:
  type: 'instruction' | 'question' | 'summary' | 'text' | 'textarea' | 'calculation' | 'substance_checklist' | 'substance_questionnaire' | 'trauma_event_input'; // <-- YENİ 'trauma_event_input' tipi
  section?: string;
  text: string;
  criteria?: string;
  options?: { label: string; value: any }[];
  substance_list?: { id: string; name: string }[]; // Madde listesi için yeni alan
  sub_questions?: SubQuestion[]; // <-- YENİ ALAN: Alt sorular için
  skipLogic?: { [key: string]: any };
  notePlaceholder?: string;
  calculation?: {
    sources: string[];
    // 'count_positive_severity' yeni hesaplama koşulumuz:
    condition: 'count_positive' | 'count_positive_mania' | 'any_positive' | 'schizophrenia_A' | 'bipolar_II_check' | 'count_positive_severity';
    threshold?: number;
    contextSourceId?: string;
  };
}
export const scid5cv_data: ScidQuestion[] = [
  ...genelDegerlendirme_data,
  ...moduleA_data,
  ...moduleB_data,
  ...moduleC_data,
  ...moduleD_data,
  ...moduleE_data,  
  ...moduleF_data,
  ...moduleG_data,  
  ...moduleH_data,
  ...moduleI_data,  
  ...moduleJ_data,
  ];