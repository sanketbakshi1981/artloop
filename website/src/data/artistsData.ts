export interface Artist {
  id: number;
  name: string;
  slug: string;
  profileImage: string;
  talents: string[];
  bio: string;
  fullBio: string;
  location: string;
  rating: number;
  totalReviews: number;
  priceRange: string;
  availability: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  featured?: boolean;
}

export const artistsData: Record<number, Artist> = {
  1: {
    id: 1,
    name: 'Vikram Kumar',
    slug: 'vikram-kumar',
    profileImage: '/eventimg/Jan2025/Jan-18-Vikram2.jpeg',
    talents: ['Acoustic Guitar', 'Bollywood Music', 'Singer-Songwriter'],
    bio: 'Award-winning acoustic artist specializing in Bollywood covers and original compositions.',
    fullBio: 'Vikram Kumar is an accomplished acoustic guitarist and vocalist with over 10 years of experience performing at intimate venues and large stages alike. His unique blend of traditional Bollywood melodies with modern acoustic arrangements has earned him a dedicated following. Vikram has performed at over 200 house concerts, cultural festivals, and private events across the East Coast. His warm stage presence and ability to connect with audiences of all ages makes every performance memorable.',
    location: 'New Jersey, USA',
    rating: 4.8,
    totalReviews: 47,
    priceRange: '$200 - $500',
    availability: 'Weekends, Friday evenings',
    socialLinks: {
      instagram: 'https://instagram.com/vikramkumar',
      youtube: 'https://youtube.com/@vikramkumarmusic',
      spotify: 'https://open.spotify.com/artist/vikramkumar',
    },
    featured: true,
  },
  2: {
    id: 2,
    name: 'Aaryav Bakshi',
    slug: 'aaryav-bakshi',
    profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    talents: ['Indian Classical Music', 'Hindustani Vocals', 'Harmonium'],
    bio: 'Accomplished Indian classical performer bringing the rich traditions of Hindustani music to contemporary audiences.',
    fullBio: 'Aaryav Bakshi is a rising star in the Indian classical music scene. Trained under renowned gurus in the Hindustani tradition, Aaryav brings centuries-old musical traditions to life with youthful energy and deep reverence. His performances blend traditional ragas with accessible presentations that welcome both seasoned connoisseurs and newcomers to Indian classical music. Aaryav has performed at major cultural centers and intimate house concerts, always creating an atmosphere of musical transcendence.',
    location: 'New Jersey, USA',
    rating: 4.9,
    totalReviews: 32,
    priceRange: '$150 - $400',
    availability: 'Flexible schedule',
    socialLinks: {
      instagram: 'https://instagram.com/aaryavbakshi',
      youtube: 'https://youtube.com/@aaryavbakshi',
    },
    featured: true,
  },
  3: {
    id: 3,
    name: 'Metropolitan Chamber Orchestra',
    slug: 'metropolitan-chamber-orchestra',
    profileImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
    talents: ['Classical Music', 'Chamber Orchestra', 'Orchestral Performance'],
    bio: 'Renowned chamber orchestra performing classical masterpieces with precision and passion.',
    fullBio: 'The Metropolitan Chamber Orchestra is a collective of classically trained musicians dedicated to bringing orchestral music to intimate settings. Founded in 2015, the ensemble has performed Mozart, Beethoven, Tchaikovsky, and contemporary composers at venues ranging from concert halls to private residences. Their mission is to break down barriers between classical music and everyday audiences, creating accessible yet sophisticated musical experiences.',
    location: 'New York, USA',
    rating: 4.7,
    totalReviews: 89,
    priceRange: '$1000 - $3000',
    availability: 'By appointment',
    socialLinks: {
      website: 'https://metropolitanchamber.org',
      instagram: 'https://instagram.com/metrochamberorch',
    },
  },
  4: {
    id: 4,
    name: 'Maya Rodriguez',
    slug: 'maya-rodriguez',
    profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    talents: ['Spoken Word', 'Poetry', 'Storytelling'],
    bio: 'Dynamic spoken word artist weaving stories of identity, culture, and human connection.',
    fullBio: 'Maya Rodriguez is a bilingual spoken word artist whose performances blend English and Spanish to explore themes of identity, immigration, love, and resilience. A three-time poetry slam champion, Maya brings raw emotion and theatrical presence to every performance. She has been featured at literary festivals, universities, and community gatherings, using her art to build bridges and spark conversations that matter.',
    location: 'Brooklyn, NY',
    rating: 4.6,
    totalReviews: 28,
    priceRange: '$100 - $300',
    availability: 'Evenings and weekends',
    socialLinks: {
      instagram: 'https://instagram.com/mayarodriguezpoetry',
    },
  },
  5: {
    id: 5,
    name: 'The Jazz Collective',
    slug: 'the-jazz-collective',
    profileImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80',
    talents: ['Jazz', 'Live Band', 'Saxophone', 'Piano', 'Drums'],
    bio: 'A versatile jazz ensemble bringing swing, bebop, and contemporary jazz to any venue.',
    fullBio: 'The Jazz Collective is a dynamic group of jazz musicians who came together through a shared love of improvisation and musical conversation. Whether playing classic standards or original compositions, the Collective creates an atmosphere of sophisticated spontaneity. Their repertoire spans swing-era classics, bebop explorations, and modern jazz interpretations. Perfect for cocktail parties, dinner events, or dedicated jazz listening sessions.',
    location: 'Manhattan, NY',
    rating: 4.8,
    totalReviews: 65,
    priceRange: '$500 - $1500',
    availability: 'Wednesday - Sunday',
    socialLinks: {
      website: 'https://thejazzcollective.com',
      spotify: 'https://open.spotify.com/artist/jazzcollective',
    },
    featured: true,
  },
  6: {
    id: 6,
    name: 'Priya Sharma',
    slug: 'priya-sharma',
    profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    talents: ['Yoga Instruction', 'Meditation', 'Sound Healing'],
    bio: 'Certified yoga instructor and meditation guide creating transformative wellness experiences.',
    fullBio: 'Priya Sharma is a 500-hour certified yoga instructor with additional training in meditation and sound healing. Her sessions blend physical asana practice with mindfulness techniques and the therapeutic vibrations of singing bowls and chimes. Priya specializes in creating customized experiences for groups, from energizing morning flows to restorative evening sessions. Her calm presence and thoughtful guidance help participants find peace and presence.',
    location: 'Jersey City, NJ',
    rating: 5.0,
    totalReviews: 41,
    priceRange: '$75 - $200',
    availability: 'Morning and evening sessions',
    socialLinks: {
      instagram: 'https://instagram.com/priyasharmayoga',
      website: 'https://priyasharmawellness.com',
    },
    featured: true,
  },
};

// Artist-Event mapping (which artists are associated with which events)
export const artistEventMapping: Record<number, number[]> = {
  1: [1], // Vikram Kumar -> Acoustic Bollywood Night
  2: [2], // Aaryav Bakshi -> Indian Classical Music Evening
  3: [3], // Metropolitan Chamber Orchestra -> Classical Gala Night
  4: [],  // Maya Rodriguez -> no events yet
  5: [],  // The Jazz Collective -> no events yet
  6: [],  // Priya Sharma -> no events yet
};

// Helper function to get all artists as an array
export const getAllArtists = (): Artist[] => {
  return Object.values(artistsData);
};

// Helper function to get a single artist by ID
export const getArtistById = (id: number): Artist | undefined => {
  return artistsData[id];
};

// Helper function to get artist by slug
export const getArtistBySlug = (slug: string): Artist | undefined => {
  return Object.values(artistsData).find(artist => artist.slug === slug);
};

// Helper function to get featured artists
export const getFeaturedArtists = (): Artist[] => {
  return Object.values(artistsData).filter(artist => artist.featured);
};

// Helper function to get artists by talent
export const getArtistsByTalent = (talent: string): Artist[] => {
  return Object.values(artistsData).filter(artist => 
    artist.talents.some(t => t.toLowerCase().includes(talent.toLowerCase()))
  );
};

// Helper function to get event IDs for an artist
export const getEventIdsForArtist = (artistId: number): number[] => {
  return artistEventMapping[artistId] || [];
};

// Helper function to get all unique talents
export const getAllTalents = (): string[] => {
  const talents = new Set<string>();
  Object.values(artistsData).forEach(artist => {
    artist.talents.forEach(talent => talents.add(talent));
  });
  return Array.from(talents).sort();
};

// Helper function to render star rating as an object with counts
export const getRatingStars = (rating: number): { full: number; half: boolean; empty: number } => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return { full: fullStars, half: hasHalfStar, empty: emptyStars };
};
