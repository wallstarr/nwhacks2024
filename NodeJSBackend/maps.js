const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');

const app = express();
const port = 3000;

// Initialize Google Maps Client
const client = new Client({});

app.get('/place-details', async (req, res) => {
    const placeId = req.query.placeId;  // Expecting a 'placeId' query parameter

    if (!placeId) {
        return res.status(400).send('Place ID is required');
    }
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                key: 'AIzaSyDGce-_j83mmZ8k2vGhZMfd7OeuNU8k-so',
            },
            timeout: 1000  // Optional, set a timeout in milliseconds
        });
        res.json(response.data.result);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/find-place', async (req, res) => {
    const query = req.query.query;  // Expecting a 'query' parameter

    if (!query) {
        return res.status(400).send('Query is required');
    }

    try {
        const response = await client.findPlaceFromText({
            params: {
                input: query,
                inputtype: 'textquery',
                fields: ['place_id', 'name',],
                key: 'AIzaSyDGce-_j83mmZ8k2vGhZMfd7OeuNU8k-so',
            },
            timeout: 1000  // Optional, set a timeout in milliseconds
        });

        res.json(response.data.candidates);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
