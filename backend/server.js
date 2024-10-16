const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let events = [];

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Scheduler API');
});

// Add event API
app.post('/events', (req, res) => {
    const { start_time, end_time } = req.body;

    if (!start_time || !end_time || start_time >= end_time) {
        return res.status(400).json({ message: 'Invalid start or end time.' });
    }

    const overlap = events.some(event => 
        start_time < event.end_time && end_time > event.start_time
    );

    if (overlap) {
        return res.status(400).json({ message: 'Event overlaps with an existing one.' });
    }

    const newEvent = { id: events.length + 1, start_time, end_time };
    events.push(newEvent);
    res.status(201).json({ message: 'Event added successfully.', event: newEvent });
});

// Get all events API
app.get('/events', (req, res) => {
    res.json(events);
});

// Delete event API
app.delete('/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found.' });
    }

    events.splice(eventIndex, 1);
    res.status(200).json({ message: 'Event deleted successfully.' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
