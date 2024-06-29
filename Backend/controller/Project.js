const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, members } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new project instance
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      status,
      members,
    });

    // Save project to database
    await project.save();

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ startDate: 'desc' });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update project by ID
exports.updateProjectById = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, members } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate, status, members },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Error updating project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: deletedProject });
  } catch (error) {
    console.error('Error deleting project by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
