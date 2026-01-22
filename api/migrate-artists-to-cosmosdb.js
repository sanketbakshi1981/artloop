#!/usr/bin/env node

/**
 * Migration Script: Import Artists to Cosmos DB
 * This script migrates artist data from the static artistsData.ts file to Cosmos DB
 * 
 * Usage:
 * 1. Set environment variables in local.settings.json or shell
 * 2. Run: node migrate-artists-to-cosmosdb.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from local.settings.json
const localSettingsPath = path.join(__dirname, 'local.settings.json');
if (fs.existsSync(localSettingsPath)) {
    const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));
    if (localSettings.Values) {
        Object.entries(localSettings.Values).forEach(([key, value]) => {
            if (!process.env[key]) {
                process.env[key] = value;
            }
        });
    }
    console.log('✅ Loaded environment variables from local.settings.json\n');
}

const { storeArtist } = require('./shared/cosmosdb');

// Static artists data from website/src/data/artistsData.ts
const artistsData = {
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
    featured: false,
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
    featured: false,
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

async function migrateArtists() {
    console.log('🚀 Starting artist migration to Cosmos DB...\n');

    // Check environment variables
    if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
        console.error('❌ Error: COSMOS_DB_ENDPOINT and COSMOS_DB_KEY must be set');
        console.log('\nSet these in your local.settings.json or as environment variables.');
        process.exit(1);
    }

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    // Migrate each artist
    for (const [id, artist] of Object.entries(artistsData)) {
        try {
            console.log(`📝 Migrating artist ${id}: ${artist.name}...`);
            // Ensure id is a string for Cosmos DB
            const artistWithStringId = { ...artist, id: String(artist.id) };
            const result = await storeArtist(artistWithStringId);

            if (result.success) {
                console.log(`   ✅ Success!`);
                successCount++;
            } else {
                console.log(`   ❌ Failed: ${result.error}`);
                errors.push({ id, name: artist.name, error: result.error });
                failureCount++;
            }
        } catch (error) {
            console.log(`   ❌ Exception: ${error.message}`);
            errors.push({ id, name: artist.name, error: error.message });
            failureCount++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount} artists`);
    console.log(`❌ Failed: ${failureCount} artists`);

    if (errors.length > 0) {
        console.log('\n❌ Errors:');
        errors.forEach(err => {
            console.log(`   - Artist ${err.id} (${err.name}): ${err.error}`);
        });
    }

    console.log('\n✨ Migration complete!\n');
    
    // Exit with appropriate code
    process.exit(failureCount > 0 ? 1 : 0);
}

// Run migration
migrateArtists().catch(error => {
    console.error('💥 Fatal error during migration:', error);
    process.exit(1);
});
