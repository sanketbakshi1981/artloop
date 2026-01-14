const { getEvent, getAllEvents } = require('../shared/cosmosdb');

/**
 * Azure Function: Get Events
 * GET /api/events - Get all events
 * GET /api/events/{id} - Get specific event by ID
 */
module.exports = async function (context, req) {
    context.log('Events GET request received');

    try {
        const eventId = context.bindingData.id;

        // If event ID is provided, get specific event
        if (eventId) {
            const result = await getEvent(eventId);
            
            if (!result.success) {
                context.res = {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: result.error || 'Event not found'
                    }
                };
                return;
            }

            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: result.item
            };
            return;
        }

        // Get all events with optional filters
        const upcoming = req.query.upcoming === 'true';
        const status = req.query.status || 'active';

        const result = await getAllEvents({ 
            upcoming,
            status
        });

        if (!result.success) {
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: result.error || 'Failed to retrieve events'
                }
            };
            return;
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                events: result.items,
                count: result.count
            }
        };

    } catch (error) {
        context.log.error('Error in events-get function:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                error: 'Internal server error',
                message: error.message
            }
        };
    }
};
