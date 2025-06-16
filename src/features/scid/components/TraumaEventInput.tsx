import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TraumaEvent } from '@/pages/Scid5CvPage';

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
    setEventData(prev => ({ ...prev, eventType: { ...prev.eventType, [field]: !prev.eventType[field] } }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{questionText}</h2>
        <div>
          <Label htmlFor="description">Örseleyici Olayın Tanımlanması</Label>
          <Textarea id="description" name="description" value={eventData.description} onChange={handleTextChange} rows={4} placeholder="Danışanın ifadesiyle olayı buraya yazın..." />
        </div>
        <div>
          <Label>Örseleyici Olayın Türü (Uygun olanları seçin):</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {[
              { id: 'death_actual', label: 'Ölüm, gerçek' }, { id: 'death_threatened', label: 'Ölüm, gözü korkutulmuş' },
              { id: 'injury_actual', label: 'Ağır yaralanma, gerçek' }, { id: 'injury_threatened', label: 'Ağır yaralanma, gözü korkutulmuş' },
              { id: 'sexual_violence_actual', label: 'Cinsel kaba güç, gerçek' }, { id: 'sexual_violence_threatened', label: 'Cinsel kaba güç, gözü korkutulmuş' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox id={item.id} checked={eventData.eventType[item.id as keyof TraumaEvent['eventType']]} onCheckedChange={() => handleCheckboxChange(item.id as keyof TraumaEvent['eventType'])} />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>Örseleyici Olayla Karşılaşma Biçimi:</Label>
          <RadioGroup value={eventData.exposureType || ''} onValueChange={(value) => setEventData(prev => ({...prev, exposureType: value as TraumaEvent['exposureType']}))} className="mt-2 space-y-1">
            <div className="flex items-center space-x-2"><RadioGroupItem value="direct" id="direct" /><Label htmlFor="direct">Doğrudan Yaşanmış</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="witnessed" id="witnessed" /><Label htmlFor="witnessed">Tanık Olunmuş</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="learned" id="learned" /><Label htmlFor="learned">Öğrenme (Aileden/Arkadaştan)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="repeated_exposure" id="repeated_exposure" /><Label htmlFor="repeated_exposure">Ayrıntılarıyla Tekrarlı Karşılaşma</Label></div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="ageAtEvent">Olay Zamanındaki Yaş</Label>
          <Input id="ageAtEvent" name="ageAtEvent" type="number" value={eventData.ageAtEvent || ''} onChange={handleTextChange} />
        </div>
        <div className="text-right pt-4">
          <Button onClick={() => onProceed(eventData)} disabled={!eventData.description}>Kaydet ve Devam Et</Button>
        </div>
      </div>
    </div>
  );
};