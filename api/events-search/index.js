const { searchEvents } = require('../shared/cosmosdb');

/**
 * Azure Function: Search Events
 * GET /api/events/search?q=searchTerm
 * Searches events by title, performer, description, or venue
 */
module.exports = async function (context, req) {
    context.log('Events SEARCH request received');

    try {
        const searchTerm = req.query.q || req.query.search;

        if (!searchTerm || searchTerm.trim() === '') {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: 'Search term is required. Use ?q=searchTerm or ?search=searchTerm'
                }
            };
            return;
        }

        const result = await searchEvents(searchTerm.trim());

        if (!result.success) {
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: 'Failed to search events',
                    message: result.error
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
                searchTerm: searchTerm.trim(),
                events: result.items,
                count: result.count
            }
        };

    } catch (error) {
        context.log.error('Error in events-search function:', error);
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
