import express from 'express';

import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showHomePage } from './index.js';
import { showCategoriesPage, showCategoryDetailsPage  } from './categories.js';
import { testErrorPage } from './errors.js';



const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);


// ... other imports

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // The :id makes it dynamic

router.get('/category/:id', showCategoryDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;