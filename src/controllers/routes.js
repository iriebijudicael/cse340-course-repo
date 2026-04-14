import express from 'express';

import { showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation, 
    showEditProjectForm, 
    processEditProjectForm, handleVolunteer, handleUnvolunteer  
} from './projects.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
    newOrganizationPage,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './organizations.js';
import { showHomePage } from './index.js';
import { showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm, } from './categories.js';
import { testErrorPage } from './errors.js';
import * as catCont from '../controllers/categories.js';
import { showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout, 
    requireLogin, requireRole, showDashboard, showAllUsers } from '../controllers/users.js';


const router = express.Router();

router.get('/', showHomePage);


// ... other imports

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), newOrganizationPage, showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);


// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);


// ... other imports
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // The :id makes it dynamic

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);


// Create
router.get('/new-category', requireRole('admin'), catCont.showNewCategoryForm);
router.post('/new-category', requireRole('admin'), catCont.categoryValidation, catCont.processNewCategoryForm);

// Edit
router.get('/edit-category/:id', requireRole('admin'), catCont.showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), catCont.categoryValidation, catCont.processEditCategoryForm);


// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
// Protect this route so ONLY admins can see the user list
router.get('/users', requireRole('admin'), showAllUsers);

router.post('/project/volunteer/:id', requireLogin, handleVolunteer);
router.post('/project/unvolunteer/:id', requireLogin, handleUnvolunteer);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;