const { searchArtists } = require('../shared/cosmosdb');

/**
 * Azure Function: Search Artists
 * GET /api/artists/search?q=searchTerm
 */
module.exports = async function (context, req) {
    context.log('Artists SEARCH request received');

    try {
        const searchTerm = req.query.q;

        if (!searchTerm) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: 'Search term is required. Use ?q=your-search-term'
                }
            };
            return;
        }

        const result = await searchArtists(searchTerm);

        if (!result.success) {
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: 'Failed to search artists',
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
                artists: result.items,
                count: result.count,
                searchTerm
            }
        };
    } catch (error) {
        context.log.error('Error in artists-search:', error);
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
