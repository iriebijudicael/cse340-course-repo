import pool from './db.js';

/**
 * Fetches all categories for the category list page
 */
const getAllCategories = async () => {
    try {
        const sql = "SELECT * FROM public.category ORDER BY category_name ASC";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        throw error;
    }
};


// 1. Get a single category by ID
const getCategoryDetails = async (id) => {
    const sql = `SELECT * FROM public.category WHERE category_id = $1`;
    const result = await pool.query(sql, [id]);
    return result.rows[0];
};

// 2. Get all categories associated with a specific project (for Tags)
const getCategoriesByProject = async (projectId) => {
    const sql = `
        SELECT c.* FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name ASC`;
    const result = await pool.query(sql, [projectId]);
    return result.rows;
};

// 3. Get all projects associated with a specific category
const getProjectsByCategory = async (categoryId) => {
    const sql = `
        SELECT p.*, o.name AS organization_name 
        FROM public.service_project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC`;
    const result = await pool.query(sql, [categoryId]);
    return result.rows;
};

export { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory };