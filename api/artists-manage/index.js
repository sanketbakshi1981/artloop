const { storeArtist, updateArtist, deleteArtist, getArtist } = require('../shared/cosmosdb');

/**
 * Azure Function: Manage Artists
 * POST /api/artists - Create new artist
 * PUT /api/artists/{id} - Update existing artist
 * DELETE /api/artists/{id} - Delete (deactivate) artist
 * 
 * NOTE: This function requires authentication (authLevel: "function")
 * Add ?code=YOUR_FUNCTION_KEY to the URL when calling
 */
module.exports = async function (context, req) {
    context.log('Artists MANAGE request received:', req.method);

    try {
        const artistId = context.bindingData.id;
        const method = req.method;

        // CREATE new artist
        if (method === 'POST') {
            const artistData = req.body;

            // Validate required fields
            const requiredFields = ['name', 'bio', 'location'];
            const missingFields = requiredFields.filter(field => !artistData[field]);

            if (missingFields.length > 0) {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Missing required fields',
                        missingFields
                    }
                };
                return;
            }

            const result = await storeArtist(artistData);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to create artist',
                        message: result.error
                    }
                };
                return;
            }

            context.res = {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    message: 'Artist created successfully',
                    artist: result.item
                }
            };
            return;
        }

        // UPDATE existing artist
        if (method === 'PUT') {
            if (!artistId) {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Artist ID is required for updates'
                    }
                };
                return;
            }

            const updates = req.body;

            // Check if artist exists
            const artistCheck = await getArtist(artistId);
            if (!artistCheck.success) {
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

            const result = await updateArtist(artistId, updates);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to update artist',
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
                    message: 'Artist updated successfully',
                    artist: result.item
                }
            };
            return;
        }

        // DELETE (deactivate) artist
        if (method === 'DELETE') {
            if (!artistId) {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Artist ID is required for deletion'
                    }
                };
                return;
            }

            // Check if artist exists
            const artistCheck = await getArtist(artistId);
            if (!artistCheck.success) {
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

            const result = await deleteArtist(artistId);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to delete artist',
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
                    message: 'Artist deleted successfully'
                }
            };
            return;
        }

        // Unsupported method
        context.res = {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                error: 'Method not allowed'
            }
        };
    } catch (error) {
        context.log.error('Error in artists-manage:', error);
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
