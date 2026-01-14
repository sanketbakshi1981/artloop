#!/usr/bin/env node

/**
 * Migration Script: Import Events to Cosmos DB
 * This script migrates event data from the static eventsData.ts file to Cosmos DB
 * 
 * Usage:
 * 1. Set environment variables in local.settings.json or shell:
 *    - COSMOS_DB_ENDPOINT
 *    - COSMOS_DB_KEY
 *    - COSMOS_DB_DATABASE (optional, defaults to 'artloop-db')
 *    - COSMOS_DB_EVENTS_CONTAINER (optional, defaults to 'events')
 * 
 * 2. Run: node migrate-events-to-cosmosdb.js
 */

const { storeEvent } = require('./shared/cosmosdb');

// Static events data from website/src/data/eventsData.ts
const eventsData = {
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
    hostEmail: 'sanket.bakshi@gmail.com',
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
    fullDescription: 'Immerse yourself in the mesmerizing world of Indian classical music with Aaryav Bakshi. Experience the depth and beauty of Hindustani classical traditions in an intimate rooftop setting. Enjoy traditional Indian refreshments and light bites as you witness this captivating performance. This is an invite-only event - you will need an invite code to register.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    price: 'Free',
    capacity: '75 guests',
    dresscode: 'Casual',
    includes: ['Welcome drink', 'Indian appetizers', 'Premium seating', 'Photo opportunities'],
    hostEmail: 'sanket.bakshi@gmail.com',
    isFree: true,
    inviteOnly: true,
    inviteCode: 'MUSIC2026',
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
    price: 'Free',
    capacity: '200 guests',
    dresscode: 'Black Tie Optional',
    includes: ['Orchestra seating', 'Program booklet', 'Champagne reception', 'Meet and greet with performers'],
    hostEmail: 'sanket.bakshi@gmail.com',
    isFree: true,
  },
};

async function migrateEvents() {
    console.log('🚀 Starting event migration to Cosmos DB...\n');

    // Check environment variables
    if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
        console.error('❌ Error: COSMOS_DB_ENDPOINT and COSMOS_DB_KEY must be set');
        console.log('\nSet these in your local.settings.json or as environment variables:');
        console.log('  COSMOS_DB_ENDPOINT=https://artloop-cosmosdb.documents.azure.com:443/');
        console.log('  COSMOS_DB_KEY=your-cosmos-db-key');
        process.exit(1);
    }

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    // Migrate each event
    for (const [id, event] of Object.entries(eventsData)) {
        try {
            console.log(`📝 Migrating event ${id}: ${event.title}...`);
            const result = await storeEvent(event);

            if (result.success) {
                console.log(`   ✅ Success!`);
                successCount++;
            } else {
                console.log(`   ❌ Failed: ${result.error}`);
                errors.push({ id, title: event.title, error: result.error });
                failureCount++;
            }
        } catch (error) {
            console.log(`   ❌ Exception: ${error.message}`);
            errors.push({ id, title: event.title, error: error.message });
            failureCount++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount} events`);
    console.log(`❌ Failed: ${failureCount} events`);

    if (errors.length > 0) {
        console.log('\n❌ Errors:');
        errors.forEach(err => {
            console.log(`   - Event ${err.id} (${err.title}): ${err.error}`);
        });
    }

    console.log('\n✨ Migration complete!\n');
    
    // Exit with appropriate code
    process.exit(failureCount > 0 ? 1 : 0);
}

// Run migration
migrateEvents().catch(error => {
    console.error('💥 Fatal error during migration:', error);
    process.exit(1);
});
