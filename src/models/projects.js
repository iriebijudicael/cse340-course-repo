
import db from './db.js';

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
      const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date AS date  /* 1. Use the real name, then alias it */
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;    /* 2. Must use the real column name here too */
    `;
      
      const query_params = [organizationId];
      const result = await db.query(query, query_params);

      return result.rows;
};

/**
 * Retrieves a specific number of upcoming projects
 */
// Get a specific number of upcoming projects
const getUpcomingProjects = async (limit) => {
    const sql = `
    SELECT 
        project_id, 
        title, 
        project_date AS date, -- The database name is project_date
        location, 
        organization_id 
    FROM public.service_project 
    WHERE project_date >= CURRENT_DATE
    ORDER BY project_date ASC 
    LIMIT $1`;
    const result = await db.query(sql, [limit]);
    return result.rows;
};

// Get one project by ID
const getProjectDetails = async (id) => {
    const sql = `
    SELECT 
        p.project_id, 
        p.title, 
        p.description, 
        p.project_date AS date, -- Aliasing here is mandatory
        p.location, 
        p.organization_id, 
        o.name AS organization_name
    FROM public.service_project p
    JOIN public.organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO public.service_project (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const sql = `
        UPDATE public.service_project 
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5 
        WHERE project_id = $6`;
    
    const params = [title, description, location, date, organizationId, projectId];
    return await db.query(sql, params);
};

// Export the model functions
export { getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    updateProject };