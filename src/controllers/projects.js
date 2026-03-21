// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

// Define any controller functions
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Update existing function
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// New function for details page
const showProjectDetailsPage = async (req, res, next) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProject(id); // Fetch the tags

    res.render('project', { 
        title: project.title, 
        project,
        categories // Pass tags to the view
    });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };