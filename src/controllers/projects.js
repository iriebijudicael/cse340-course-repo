// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';


// Define any controller functions
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Update existing function
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// New function for details
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id; // Extract :id from URL
    const project = await getProjectDetails(projectId);

    res.render('project', { 
        title: project.title, 
        project 
    });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };