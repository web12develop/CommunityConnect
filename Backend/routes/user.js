const express = require("express");
const router = express.Router();

const {signup, login } = require("../controller/Auth");
const {getProfile} = require("../controller/Users");
const { auth, isCommunityOrganization, isCommunityBusiness} = require('../middleware/auth');
const {createEvent,getAllEvents,getEventById,updateEventById,deleteEventById} = require("../controller/Event");
const {createProject, getAllProjects, getProjectById, updateProjectById, deleteProjectById } = require("../controller/Project");
const {createNews, getAllNews, getNewsById, updateNewsById, deleteNewsById } = require("../controller/News");
const {createVolunteerOpportunity, getAllVolunteerOpportunities,getVolunteerOpportunityById,updateVolunteerOpportunityById,deleteVolunteerOpportunityById } = require("../controller/Volunteer");

//routes mapping
//Profile page routes
router.get('/user', auth, getProfile);
router.post("/user/signup", signup);
router.post("/user/login", login);

//Events page route
router.post("/events", auth, createEvent);
router.get("/events", getAllEvents);
router.get("/events/:id",  getEventById);
router.put("/events/:id", auth, updateEventById);
router.delete("/events/:id",auth, deleteEventById);

//News page route
router.post("/news", createNews);
router.get("/news", getAllNews);
router.get("/news/:id", getNewsById);
router.put("/news/:id", updateNewsById);
router.delete("/news/:id", deleteNewsById);

// Project routes
router.post('/projects', auth, isCommunityOrganization, isCommunityBusiness, createProject);
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', auth, isCommunityOrganization, isCommunityBusiness, updateProjectById);
router.delete('/projects/:id', auth, isCommunityOrganization, isCommunityBusiness, deleteProjectById);

//Voluteer page route
router.post("/voluteers",auth, isCommunityOrganization, createVolunteerOpportunity);
router.get("/voluteers", getAllVolunteerOpportunities);
router.get("/voluteers/:id", getVolunteerOpportunityById);
router.put("/voluteers/:id", auth, isCommunityOrganization, updateVolunteerOpportunityById);
router.delete("/voluteers/:id",auth, isCommunityOrganization, deleteVolunteerOpportunityById);

module.exports = router;