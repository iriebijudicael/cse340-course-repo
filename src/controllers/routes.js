import express from 'express';

import { showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation, 
    showEditProjectForm, 
    processEditProjectForm  
} from './projects.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
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


const router = express.Router();

router.get('/', showHomePage);


// ... other imports

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);


// ... other imports

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // The :id makes it dynamic

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);



// Create
router.get('/new-category', catCont.showNewCategoryForm);
router.post('/new-category', catCont.categoryValidation, catCont.processNewCategoryForm);

// Edit
router.get('/edit-category/:id', catCont.showEditCategoryForm);
router.post('/edit-category/:id', catCont.categoryValidation, catCont.processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;