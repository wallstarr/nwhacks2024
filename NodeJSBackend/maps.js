const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
// Initialize Google Maps Client
const client = new Client({});
const YOUR_API_KEY = "AIzaSyDGce-_j83mmZ8k2vGhZMfd7OeuNU8k-so"

app.get('/place-details', async (req, res) => {
    const placeId = req.query.placeId;  // Expecting a 'placeId' query parameter

    if (!placeId) {
        return res.status(400).send('Place ID is required');
    }
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'opening_hours'],
                key: YOUR_API_KEY,
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
                key: YOUR_API_KEY,
            },
            timeout: 1000  // Optional, set a timeout in milliseconds
        });

        res.json(response.data.candidates);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/places-coordinates', async (req, res) => {
    const places = ["Pacific Center", "Richmond Center"] // Assuming the body contains a "places" array

    if (!places || !Array.isArray(places)) {
        return res.status(400).send('A valid array of place names is required');
    }

    const results = [];
    console.log("ahiuhd")

    for (const placeName of places) {
        try {
            const response = await client.findPlaceFromText({
                params: {
                    input: placeName,
                    inputtype: 'textquery',
                    fields: ['name', 'geometry', 'place_id'],
                    key: YOUR_API_KEY,
                },
                timeout: 1000
            });

            const placeData = response.data.candidates[0]; // Taking the first candidate
            if (placeData) {
                results.push({
                    name: placeData.name,
                    latitude: placeData.geometry.location.lat,
                    longitude: placeData.geometry.location.lng,
                    placeId: placeData.place_id
                });
            }
        } catch (error) {
            console.error(`Error fetching coordinates for ${placeName}: `, error);
            // Decide how to handle individual errors; for now, we'll skip failed ones
        }
    }

    res.json(results);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
