const { storeEvent, updateEvent, deleteEvent, getEvent } = require('../shared/cosmosdb');

/**
 * Azure Function: Manage Events
 * POST /api/events - Create new event
 * PUT /api/events/{id} - Update existing event
 * DELETE /api/events/{id} - Delete (cancel) event
 * 
 * NOTE: This function requires authentication (authLevel: "function")
 * Add ?code=YOUR_FUNCTION_KEY to the URL when calling
 */
module.exports = async function (context, req) {
    context.log('Events MANAGE request received:', req.method);

    try {
        const eventId = context.bindingData.id;
        const method = req.method;

        // CREATE new event
        if (method === 'POST') {
            const eventData = req.body;

            // Validate required fields
            const requiredFields = ['title', 'date', 'time', 'venue', 'performer', 'description'];
            const missingFields = requiredFields.filter(field => !eventData[field]);

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

            const result = await storeEvent(eventData);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to create event',
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
                    message: 'Event created successfully',
                    event: result.item
                }
            };
            return;
        }

        // UPDATE existing event
        if (method === 'PUT') {
            if (!eventId) {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Event ID is required for updates'
                    }
                };
                return;
            }

            const updates = req.body;

            // Check if event exists
            const eventCheck = await getEvent(eventId);
            if (!eventCheck.success) {
                context.res = {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Event not found'
                    }
                };
                return;
            }

            const result = await updateEvent(eventId, updates);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to update event',
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
                    message: 'Event updated successfully',
                    event: result.item
                }
            };
            return;
        }

        // DELETE (cancel) event
        if (method === 'DELETE') {
            if (!eventId) {
                context.res = {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Event ID is required for deletion'
                    }
                };
                return;
            }

            const result = await deleteEvent(eventId);

            if (!result.success) {
                context.res = {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: {
                        error: 'Failed to delete event',
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
                    message: 'Event cancelled successfully',
                    event: result.item
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
        context.log.error('Error in events-manage function:', error);
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
