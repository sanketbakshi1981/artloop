const { getArtist, getAllArtists } = require('../shared/cosmosdb');

/**
 * Azure Function: Get Artists
 * GET /api/artists - Get all artists
 * GET /api/artists/{id} - Get specific artist by ID
 * 
 * Query parameters:
 * - status: Filter by status (active, inactive)
 * - featured: If 'true', only return featured artists
 */
module.exports = async function (context, req) {
    context.log('Artists GET request received');

    try {
        const artistId = context.bindingData.id;

        // If ID provided, get specific artist
        if (artistId) {
            const result = await getArtist(artistId);

            if (!result.success) {
                context.res = {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Artist not found'
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

        // Get all artists with optional filtering
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.featured === 'true') filters.featured = true;

        const result = await getAllArtists(filters);

        if (!result.success) {
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    error: 'Failed to fetch artists',
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
                count: result.count
            }
        };
    } catch (error) {
        context.log.error('Error in artists-get:', error);
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
