export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  performer: string;
  performerBio: string;
  description: string;
  fullDescription: string;
  image: string;
  price: string;
  capacity: string;
  dresscode: string;
  includes: string[];
}

export const eventsData: Record<number, Event> = {
  1: {
    id: 1,
    title: 'Acoustic Bollywood Night',
    date: 'January 18, 2026',
    time: '7:00 PM - 10:00 PM',
    venue: '18 Pemberton Dr, Matawan, NJ',
    venueAddress: '18 Pemberton Dr, Matawan, NJ',
    performer: 'Vikram Kumar',
    performerBio: 'Award-winning jazz ensemble with 15 years of experience performing at prestigious venues worldwide.',
    description: 'A fun evening of your favorite bollywood tunes performed live on acoustic guitar',
    fullDescription: 'Join us for A fun evening of your favorite bollywood tunes performed live on acoustic guitar by Vikram Kumar.',
    image: '/eventimg/Jan2025/Jan-18-Vikram2.jpeg',
    price: '$35',
    capacity: '25 guests',
    dresscode: 'Smart Casual',
    includes: ['Light appetizers', 'Reserved seating', 'Meet and greet with Vikram'],
  },
  2: {
    id: 2,
    title: 'Indian Classical Music Evening',
    date: 'January 28, 2026',
    time: '6:00 PM - 9:00 PM',
    venue: 'Rooftop Terrace Test',
    venueAddress: '123 Skyline Avenue, Rooftop Level',
    performer: 'Aaryav Bakshi',
    performerBio: 'Accomplished Indian classical performer bringing the rich traditions of Hindustani music to contemporary audiences.',
    description: 'An enchanting evening of Indian classical music',
    fullDescription: 'Immerse yourself in the mesmerizing world of Indian classical music with Aaryav Bakshi. Experience the depth and beauty of Hindustani classical traditions in an intimate rooftop setting. Enjoy traditional Indian refreshments and light bites as you witness this captivating performance.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    price: '$65',
    capacity: '75 guests',
    dresscode: 'Casual',
    includes: ['Welcome drink', 'Indian appetizers', 'Premium seating', 'Photo opportunities'],
  },
  3: {
    id: 3,
    title: 'Classical Gala Night',
    date: 'February 10, 2026',
    time: '8:00 PM - 11:00 PM',
    venue: 'Symphony Center',
    venueAddress: '789 Culture Boulevard, Grand Hall',
    performer: 'Metropolitan Chamber Orchestra',
    performerBio: 'Renowned chamber orchestra performing classical masterpieces with precision and passion.',
    description: 'A sophisticated evening of classical masterpieces',
    fullDescription: 'Immerse yourself in the timeless beauty of classical music with the Metropolitan Chamber Orchestra. This gala evening features works by Mozart, Beethoven, and Tchaikovsky, performed in the acoustically perfect Symphony Center. A champagne reception follows the performance.',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=80',
    price: '$95',
    capacity: '200 guests',
    dresscode: 'Black Tie Optional',
    includes: ['Orchestra seating', 'Program booklet', 'Champagne reception', 'Meet and greet with performers'],
  },
};

// Helper function to get all events as an array
export const getAllEvents = (): Event[] => {
  return Object.values(eventsData);
};

// Helper function to get a single event by ID
export const getEventById = (id: number): Event | undefined => {
  return eventsData[id];
};
