// Import any needed model functions
import { getAllOrganizations } from '../models/organizations.js';
import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { body, validationResult } from 'express-validator';


const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Define any controller functions
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Update existing function
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    // NEW: Fetch tags for this project
    const categories = await getCategoriesByProject(id); 

    if (!project) return next();

    res.render('project', { 
        title: project.title, 
        project, 
        categories // Pass tags to the view
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // 1. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // STOP and redirect back to the form
        return res.redirect('/new-project');
    }

    // 2. If validation passed, proceed to DB logic
    const { title, description, location, date, organizationId } = req.body;
    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        req.flash('error', 'Database error occurred.');
        res.redirect('/new-project');
    }
};

// 1. Show the form pre-filled with data
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    
    // Get the project and all organizations for the dropdown
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    res.render('edit-project', { project, organizations });
};

// 2. Process the "Save" button
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    await updateProject(projectId, title, description, location, date, organizationId);
    
    res.redirect(`/project/${projectId}`);
};


const handleVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have signed up to volunteer!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        res.redirect(`/project/${projectId}`);
    }
};

const handleUnvolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You are no longer volunteering for this project.');
    res.redirect(req.get('Referrer') || '/dashboard'); // Returns user to where they came from
};

// Export any controller functions
export { showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm, 
    projectValidation, handleVolunteer, handleUnvolunteer };