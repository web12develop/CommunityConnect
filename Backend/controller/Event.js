// controllers/eventController.js

const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, organizer } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new event instance
    const event = new Event({
      title,
      description,
      date,
      location,
      organizer,
    });

    // Save event to database
    await event.save();

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 'desc' });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update event by ID
exports.updateEventById = async (req, res) => {
  try {
    const { title, description, date, location, organizer } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, organizer },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Error updating event by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: deletedEvent });
  } catch (error) {
    console.error('Error deleting event by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};