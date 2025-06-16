// src/features/scid/components/TraumaEventInput.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TraumaEvent } from '@/pages/Scid5CvPage'; // Tipi ana sayfadan import ettiğimizi varsayalım

interface TraumaEventInputProps {
  questionText: string;
  initialData: TraumaEvent | null;
  onProceed: (data: TraumaEvent) => void;
}

export const TraumaEventInput: React.FC<TraumaEventInputProps> = ({ questionText, initialData, onProceed }) => {
  const [eventData, setEventData] = useState<TraumaEvent>(initialData || {
    description: '',
    eventType: {
      death_actual: false, death_threatened: false,
      injury_actual: false, injury_threatened: false,
      sexual_violence_actual: false, sexual_violence_threatened: false
    },
    exposureType: null,
    ageAtEvent: null,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: name === 'ageAtEvent' ? (value === '' ? null : Number(value)) : value }));
  };

  const handleCheckboxChange = (field: keyof TraumaEvent['eventType']) => {
    setEventData(prev => ({
      ...prev,
      eventType: { ...prev.eventType, [field]: !prev.eventType[field] }
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{questionText}</h2>
        
        <div>
          <Label htmlFor="description">Örseleyici Olayın Tanımlanması</Label>
          <Textarea id="description" name="description" value={eventData.description} onChange={handleTextChange} rows={4} />
        </div>

        <div>
          <Label>Örseleyici Olayın Türü (Uygun olan hepsini belirtin):</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(eventData.eventType).map(key => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={key} checked={eventData.eventType[key as keyof TraumaEvent['eventType']]} onCheckedChange={() => handleCheckboxChange(key as keyof TraumaEvent['eventType'])} />
                <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Örseleyici Olayla Karşılaşma Biçimi:</Label>
          <RadioGroup value={eventData.exposureType || ''} onValueChange={(value) => setEventData(prev => ({...prev, exposureType: value as TraumaEvent['exposureType']}))} className="mt-2">
            <div className="flex items-center space-x-2"><RadioGroupItem value="direct" id="direct" /><Label htmlFor="direct">Doğrudan Yaşanmış</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="witnessed" id="witnessed" /><Label htmlFor="witnessed">Başkalarının Başına Geldiğine Tanık Olunmuş</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="learned" id="learned" /><Label htmlFor="learned">Aileden Birinin Başına Geldiğini Öğrenme</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="repeated_exposure" id="repeated_exposure" /><Label htmlFor="repeated_exposure">Ayrıntılarıyla Yeniden Yeniden Karşılaşma</Label></div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="ageAtEvent">Olay Zamanındaki Yaş</Label>
          <Input id="ageAtEvent" name="ageAtEvent" type="number" value={eventData.ageAtEvent || ''} onChange={handleTextChange} />
        </div>
        
        <div className="text-right">
          <Button onClick={() => onProceed(eventData)}>Kaydet ve Devam Et</Button>
        </div>
      </div>
    </div>
  );
};