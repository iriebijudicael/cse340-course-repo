
import pool from './db.js';

/**
 * Fetches all projects joined with organization names
 */
const getAllProjects = async () => {
    try {
        // We use an alias (p for projects, o for organizations) to keep it clean
        const sql = `
            SELECT p.*, o.name AS organization_name 
            FROM public.service_project p
            JOIN public.organization o ON p.organization_id = o.organization_id
            ORDER BY p.project_date ASC`;
        
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};


const getProjectsByOrganizationId = async (organizationId) => {
    // Change "FROM project" to "FROM public.service_project"
    const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        project_date
      FROM public.service_project 
      WHERE organization_id = $1
      ORDER BY project_date ASC;
    `;
    
    const result = await pool.query(query, [organizationId]);
    return result.rows;
};

/**
 * Retrieves a specific number of upcoming projects
 */
const getUpcomingProjects = async (number_of_projects) => {
    const sql = `
        SELECT p.project_id, p.title, p.description, p.project_date, p.location, 
               p.organization_id, o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1`;
    const result = await pool.query(sql, [number_of_projects]);
    return result.rows;
};

/**
 * Retrieves a single project by its ID
 */
const getProjectDetails = async (id) => {
    const sql = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.project_date AS date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1`;
    
    const result = await pool.query(sql, [id]);
    return result.rows[0]; // Returns the single project object
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };