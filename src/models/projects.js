import pool from './db.js';

/**
 * Fetches all projects joined with organization names
 */
export const getAllProjects = async () => {
    try {
        // We use an alias (p for projects, o for organizations) to keep it clean
        const sql = `
            SELECT p.*, o.name AS organization_name 
            FROM public.service_project p
            JOIN public.organization o ON p.organization_id = o.organization_id
            ORDER BY p.project_date ASC`;
        
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};