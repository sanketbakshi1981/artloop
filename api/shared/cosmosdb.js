const { CosmosClient } = require('@azure/cosmos');

/**
 * CosmosDB Helper Module
 * Manages connection and operations with Azure Cosmos DB for storing registration data
 */

// Singleton CosmosDB client
let cosmosClient = null;
let database = null;
let container = null;

/**
 * Initialize CosmosDB connection
 * @param {string} endpoint - CosmosDB endpoint URL
 * @param {string} key - CosmosDB access key
 * @param {string} databaseId - Database name (default: 'artloop-db')
 * @param {string} containerId - Container name (default: 'registrations')
 */
async function initializeCosmosDB(
    endpoint = process.env.COSMOS_DB_ENDPOINT,
    key = process.env.COSMOS_DB_KEY,
    databaseId = process.env.COSMOS_DB_DATABASE || 'artloop-db',
    containerId = process.env.COSMOS_DB_CONTAINER || 'registrations'
) {
    try {
        if (!endpoint || !key) {
            throw new Error('CosmosDB endpoint and key are required. Please set COSMOS_DB_ENDPOINT and COSMOS_DB_KEY environment variables.');
        }

        // Create CosmosDB client
        cosmosClient = new CosmosClient({ endpoint, key });

        // Create database if it doesn't exist
        const { database: db } = await cosmosClient.databases.createIfNotExists({
            id: databaseId
        });
        database = db;

        // Create container if it doesn't exist
        // Using registrationCode as partition key for optimal querying
        const { container: cont } = await database.containers.createIfNotExists({
            id: containerId,
            partitionKey: {
                paths: ['/registrationCode'],
                kind: 'Hash'
            }
        });
        container = cont;

        console.log(`✅ CosmosDB initialized: Database '${databaseId}', Container '${containerId}'`);
        return { success: true, database, container };
    } catch (error) {
        console.error('❌ Error initializing CosmosDB:', error);
        throw error;
    }
}

/**
 * Store registration data in CosmosDB
 * @param {Object} registrationData - Registration data to store
 * @returns {Promise<Object>} Created item with metadata
 */
async function storeRegistration(registrationData) {
    try {
        if (!container) {
            await initializeCosmosDB();
        }

        // Add metadata
        const item = {
            id: registrationData.registrationCode, // Use registrationCode as document id
            ...registrationData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active', // active, cancelled, completed
            checkInStatus: 'pending', // pending, checked-in
            checkInTime: null
        };

        const { resource: createdItem } = await container.items.create(item);
        console.log(`✅ Registration stored in CosmosDB: ${registrationData.registrationCode}`);
        
        // Increment event registration count if eventId is provided
        if (registrationData.eventId) {
            try {
                await incrementEventRegistrationCount(registrationData.eventId);
            } catch (eventError) {
                console.warn('⚠️ Could not increment event registration count:', eventError.message);
                // Don't fail the registration if event count increment fails
            }
        }
        
        return { success: true, item: createdItem };
    } catch (error) {
        console.error('❌ Error storing registration in CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Retrieve registration by registration code
 * @param {string} registrationCode - Registration code to look up
 * @returns {Promise<Object>} Registration data or null
 */
async function getRegistration(registrationCode) {
    try {
        if (!container) {
            await initializeCosmosDB();
        }

        const { resource: item } = await container.item(registrationCode, registrationCode).read();
        return { success: true, item };
    } catch (error) {
        if (error.code === 404) {
            console.log(`Registration not found: ${registrationCode}`);
            return { success: false, error: 'Registration not found' };
        }
        console.error('❌ Error retrieving registration from CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update registration status (e.g., check-in)
 * @param {string} registrationCode - Registration code
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated item
 */
async function updateRegistration(registrationCode, updates) {
    try {
        if (!container) {
            await initializeCosmosDB();
        }

        // Get existing item
        const { resource: existingItem } = await container.item(registrationCode, registrationCode).read();

        // Merge updates
        const updatedItem = {
            ...existingItem,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        const { resource: result } = await container.item(registrationCode, registrationCode).replace(updatedItem);
        console.log(`✅ Registration updated in CosmosDB: ${registrationCode}`);
        return { success: true, item: result };
    } catch (error) {
        console.error('❌ Error updating registration in CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check-in an attendee at the event
 * @param {string} registrationCode - Registration code
 * @returns {Promise<Object>} Updated registration with check-in status
 */
async function checkInAttendee(registrationCode) {
    return updateRegistration(registrationCode, {
        checkInStatus: 'checked-in',
        checkInTime: new Date().toISOString()
    });
}

/**
 * Query registrations by event
 * @param {string} eventTitle - Event title to filter by
 * @returns {Promise<Array>} List of registrations for the event
 */
async function getRegistrationsByEvent(eventTitle) {
    try {
        if (!container) {
            await initializeCosmosDB();
        }

        const querySpec = {
            query: 'SELECT * FROM c WHERE c.eventTitle = @eventTitle ORDER BY c.createdAt DESC',
            parameters: [
                {
                    name: '@eventTitle',
                    value: eventTitle
                }
            ]
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();
        return { success: true, items, count: items.length };
    } catch (error) {
        console.error('❌ Error querying registrations by event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get registration statistics for an event
 * @param {string} eventTitle - Event title
 * @returns {Promise<Object>} Statistics including total, checked-in, pending
 */
async function getEventStatistics(eventTitle) {
    try {
        const result = await getRegistrationsByEvent(eventTitle);
        if (!result.success) {
            return result;
        }

        const stats = {
            total: result.items.length,
            checkedIn: result.items.filter(item => item.checkInStatus === 'checked-in').length,
            pending: result.items.filter(item => item.checkInStatus === 'pending').length,
            totalAttendees: result.items.reduce((sum, item) => sum + (item.ticketQuantity || 0), 0)
        };

        return { success: true, stats };
    } catch (error) {
        console.error('❌ Error calculating event statistics:', error);
        return { success: false, error: error.message };
    }
}

/**
 * ====================
 * EVENT MANAGEMENT
 * ====================
 */

/**
 * Store event data in CosmosDB
 * @param {Object} eventData - Event data to store
 * @returns {Promise<Object>} Created item with metadata
 */
async function storeEvent(eventData) {
    try {
        // Initialize events container
        const eventsContainer = await getEventsContainer();

        // Add metadata
        const item = {
            id: eventData.id ? eventData.id.toString() : Date.now().toString(),
            ...eventData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active', // active, cancelled, completed, draft
            registrationCount: 0
        };

        const { resource: createdItem } = await eventsContainer.items.create(item);
        console.log(`✅ Event stored in CosmosDB: ${item.id} - ${item.title}`);
        return { success: true, item: createdItem };
    } catch (error) {
        console.error('❌ Error storing event in CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get events container (separate from registrations)
 */
async function getEventsContainer() {
    try {
        if (!database) {
            await initializeCosmosDB();
        }

        const containerId = process.env.COSMOS_DB_EVENTS_CONTAINER || 'events';
        
        // Create events container if it doesn't exist
        const { container } = await database.containers.createIfNotExists({
            id: containerId,
            partitionKey: {
                paths: ['/id'],
                kind: 'Hash'
            }
        });

        console.log(`✅ Events container ready: ${containerId}`);
        return container;
    } catch (error) {
        console.error('❌ Error getting events container:', error);
        throw error;
    }
}

/**
 * Retrieve event by ID
 * @param {string|number} eventId - Event ID to look up
 * @returns {Promise<Object>} Event data or null
 */
async function getEvent(eventId) {
    try {
        const eventsContainer = await getEventsContainer();
        const id = eventId.toString();
        
        const { resource: item } = await eventsContainer.item(id, id).read();
        return { success: true, item };
    } catch (error) {
        if (error.code === 404) {
            console.log(`Event not found: ${eventId}`);
            return { success: false, error: 'Event not found' };
        }
        console.error('❌ Error retrieving event from CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all events with optional filtering
 * @param {Object} filters - Optional filters (status, upcoming, etc.)
 * @returns {Promise<Array>} List of events
 */
async function getAllEvents(filters = {}) {
    try {
        const eventsContainer = await getEventsContainer();
        
        let querySpec = {
            query: 'SELECT * FROM c WHERE c.status = @status ORDER BY c.date ASC',
            parameters: [
                {
                    name: '@status',
                    value: filters.status || 'active'
                }
            ]
        };

        // If filtering for upcoming events only
        if (filters.upcoming) {
            querySpec = {
                query: 'SELECT * FROM c WHERE c.status = @status AND c.date >= @today ORDER BY c.date ASC',
                parameters: [
                    {
                        name: '@status',
                        value: 'active'
                    },
                    {
                        name: '@today',
                        value: new Date().toISOString().split('T')[0]
                    }
                ]
            };
        }

        const { resources: items } = await eventsContainer.items.query(querySpec).fetchAll();
        return { success: true, items, count: items.length };
    } catch (error) {
        console.error('❌ Error querying events:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Search events by keyword
 * @param {string} searchTerm - Search term for title, performer, or description
 * @returns {Promise<Array>} List of matching events
 */
async function searchEvents(searchTerm) {
    try {
        const eventsContainer = await getEventsContainer();
        
        const querySpec = {
            query: `SELECT * FROM c WHERE c.status = 'active' AND (
                CONTAINS(LOWER(c.title), LOWER(@searchTerm)) OR
                CONTAINS(LOWER(c.performer), LOWER(@searchTerm)) OR
                CONTAINS(LOWER(c.description), LOWER(@searchTerm)) OR
                CONTAINS(LOWER(c.venue), LOWER(@searchTerm))
            ) ORDER BY c.date ASC`,
            parameters: [
                {
                    name: '@searchTerm',
                    value: searchTerm
                }
            ]
        };

        const { resources: items } = await eventsContainer.items.query(querySpec).fetchAll();
        return { success: true, items, count: items.length };
    } catch (error) {
        console.error('❌ Error searching events:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update event data
 * @param {string|number} eventId - Event ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated item
 */
async function updateEvent(eventId, updates) {
    try {
        const eventsContainer = await getEventsContainer();
        const id = eventId.toString();

        // Get existing item
        const { resource: existingItem } = await eventsContainer.item(id, id).read();

        // Merge updates
        const updatedItem = {
            ...existingItem,
            ...updates,
            id: id, // Ensure id doesn't change
            updatedAt: new Date().toISOString()
        };

        const { resource: result } = await eventsContainer.item(id, id).replace(updatedItem);
        console.log(`✅ Event updated in CosmosDB: ${id}`);
        return { success: true, item: result };
    } catch (error) {
        console.error('❌ Error updating event in CosmosDB:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete event (soft delete by setting status to 'cancelled')
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} Result
 */
async function deleteEvent(eventId) {
    try {
        return await updateEvent(eventId, { status: 'cancelled' });
    } catch (error) {
        console.error('❌ Error deleting event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Increment registration count for an event
 * @param {string|number} eventId - Event ID
 * @returns {Promise<Object>} Updated event
 */
async function incrementEventRegistrationCount(eventId) {
    try {
        const eventsContainer = await getEventsContainer();
        const id = eventId.toString();

        const { resource: existingItem } = await eventsContainer.item(id, id).read();
        const newCount = (existingItem.registrationCount || 0) + 1;

        return await updateEvent(id, { registrationCount: newCount });
    } catch (error) {
        console.error('❌ Error incrementing registration count:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    initializeCosmosDB,
    // Registration functions
    storeRegistration,
    getRegistration,
    updateRegistration,
    checkInAttendee,
    getRegistrationsByEvent,
    getEventStatistics,
    // Event management functions
    storeEvent,
    getEvent,
    getAllEvents,
    searchEvents,
    updateEvent,
    deleteEvent,
    incrementEventRegistrationCount,
    getEventsContainer
};
