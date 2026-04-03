import db from './db.js';

/**
 * Fetches all categories for the category list page
 */
const getAllCategories = async () => {
    try {
        const sql = "SELECT * FROM public.category ORDER BY category_name ASC";
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        throw error;
    }
};


// 1. Get a single category by ID
const getCategoryDetails = async (id) => {
    const sql = `SELECT * FROM public.category WHERE category_id = $1`;
    const result = await db.query(sql, [id]);
    return result.rows[0];
};

// 2. Get all categories associated with a specific project (for Tags)
const getCategoriesByProject = async (projectId) => {
    const sql = `
        SELECT c.* FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name ASC`;
    const result = await db.query(sql, [projectId]);
    return result.rows;
};

// 1. Add the 'export' keyword here
export const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name 
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1`;
    
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// 3. Get all projects associated with a specific category
const getProjectsByCategory = async (categoryId) => {
    const sql = `
        SELECT p.project_id, p.title, p.project_date, o.name AS organization_name
        FROM public.service_project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC`;
    const result = await db.query(sql, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// Add these to src/models/categories.js

const createCategory = async (categoryName) => {
    const sql = 'INSERT INTO public.category (category_name) VALUES ($1) RETURNING category_id';
    const result = await db.query(sql, [categoryName]);
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, categoryName) => {
    const sql = 'UPDATE public.category SET category_name = $1 WHERE category_id = $2 RETURNING *';
    const result = await db.query(sql, [categoryName, categoryId]);
    
    if (result.rowCount === 0) {
        throw new Error("Category update failed.");
    }
    return result.rows[0];
};

// Ensure getCategoryById exists to pre-populate the edit form
export const getCategoryById = async (categoryId) => {
    const sql = 'SELECT * FROM public.category WHERE category_id = $1';
    const result = await db.query(sql, [categoryId]);
    return result.rows[0];
};

export { getAllCategories, 
    getCategoryDetails, 
    getCategoriesByProject, 
    getProjectsByCategory, 
    assignCategoryToProject, 
    updateCategoryAssignments,
    createCategory,
    updateCategory
};