import React, { useState } from 'react';
import Button from './Button';
import { NewPostPayload } from '../types';

interface GuestbookFormProps {
  onSubmit: (post: NewPostPayload) => Promise<void>;
  onCancel: () => void;
}

const GuestbookForm: React.FC<GuestbookFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageType, setImageType] = useState<'none' | 'random'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const payload: NewPostPayload = {
      author: name,
      content: message,
      type: 'guestbook',
      image: imageType === 'random' 
        ? `https://picsum.photos/seed/${Date.now()}/300/200` 
        : undefined
    };

    await onSubmit(payload);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-cyan-100 border-4 border-cyan-500 p-6 rounded-3xl shadow-xl animate-bounce-in relative">
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-bold p-2 rotate-12 border-2 border-black rounded-full shadow-lg">
            Schrijf mee!
        </div>
      <h2 className="text-2xl font-bold mb-4 text-cyan-800 drop-shadow-sm font-comic">
        ✍️ Laat een krabbel achter
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-cyan-900 mb-1">Je Naam:</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full border-2 border-cyan-400 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 disabled:opacity-50"
            placeholder="Bijv. SuperKees123"
            maxLength={30}
            required
          />
        </div>

        <div>
          <label className="block font-bold text-cyan-900 mb-1">Je Berichtje:</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="w-full border-2 border-cyan-400 rounded-lg p-2 h-32 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 disabled:opacity-50"
            placeholder="Typ hier iets leuks..."
            required
            maxLength={500}
          />
        </div>

        <div>
             <label className="block font-bold text-cyan-900 mb-2">Voeg een plaatje toe (optioneel):</label>
             <div className="flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded border border-cyan-300">
                     <input 
                        type="radio" 
                        name="img" 
                        checked={imageType === 'none'} 
                        onChange={() => setImageType('none')}
                        disabled={isSubmitting}
                     />
                     <span>Geen</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded border border-cyan-300">
                     <input 
                        type="radio" 
                        name="img" 
                        checked={imageType === 'random'} 
                        onChange={() => setImageType('random')}
                        disabled={isSubmitting}
                     />
                     <span>Willekeurig plaatje</span>
                 </label>
             </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="success" size="md" disabled={isSubmitting}>
            {isSubmitting ? 'Bezig met versturen...' : 'Verstuur Krabbel'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} size="md" disabled={isSubmitting}>
            Annuleren
          </Button>
        </div>
        
        <p className="text-xs text-cyan-700 italic mt-2 text-center">
            * Berichtjes worden eerst gecheckt door de moderator voordat ze live gaan.
        </p>
      </form>
    </div>
  );
};

export default GuestbookForm;
