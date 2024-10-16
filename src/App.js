import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      console.log('Fetched events:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Unable to fetch events.');
    }
  };

  // Add a new event
  const handleAddEvent = async () => {
    if (startTime === '' || endTime === '' || parseInt(startTime) >= parseInt(endTime)) {
      setErrorMessage('Invalid input: Start time must be less than end time.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/events', {
        start_time: parseInt(startTime),
        end_time: parseInt(endTime),
      });
      setErrorMessage('');
      fetchEvents(); // Refresh events after adding
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding event.');
    }
  };

  // Delete event by ID
  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/events/${eventId}`);

      if (response.status === 200) {
        console.log('Event deleted successfully.');
        setEvents(events.filter((event) => event.id !== eventId)); // Update state
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage(error.response?.data?.message || 'Error deleting event.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daily Event Scheduler</h1>

      <div className="main">
        <input
          type="number"
          placeholder="Start Time (0-23)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="number"
          placeholder="End Time (1-24)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h2>Scheduled Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id}> {/* Use unique ID as key */}
            <span className="event-icon">🗓️</span>
            <span className="event-text">
              {event.start_time}:00 - {event.end_time}:00
            </span>
            <button onClick={() => deleteEvent(event.id)}>Delete</button> {/* Use event.id */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
