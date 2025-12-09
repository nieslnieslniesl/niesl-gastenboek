import { Post } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    type: 'admin',
    author: 'Niesl (Admin)',
    content: 'Welkom op mijn vernieuwde **Niesl.nl**! Laat een leuk berichtje achter in mijn gastenboek. 💖',
    timestamp: Date.now() - 10000000,
    status: 'approved',
    image: 'https://picsum.photos/400/200'
  },
  {
    id: '2',
    type: 'guestbook',
    author: 'Chantal_xoxo',
    content: 'Heeeeeey Niesl! Wat een gave site heb je man. Doet me denken aan vroeger! Kusjes C.',
    timestamp: Date.now() - 500000,
    status: 'approved',
    image: 'https://picsum.photos/seed/chantal/100/100'
  },
  {
    id: '3',
    type: 'guestbook',
    author: 'Kevin_Skater_99',
    content: 'Eerste!!!1!',
    timestamp: Date.now() - 200000,
    status: 'pending' // Still needs moderation
  }
];

export const MOCK_ADMIN_PASSWORD = 'admin';
