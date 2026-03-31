import express from 'express';

import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from './organizations.js';
import { showHomePage } from './index.js';
import { showCategoriesPage, showCategoryDetailsPage  } from './categories.js';
import { testErrorPage } from './errors.js';



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


// ... other imports

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // The :id makes it dynamic

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;