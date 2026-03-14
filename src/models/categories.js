import pool from './db.js';

/**
 * Fetches all categories for the category list page
 */
export const getAllCategories = async () => {
    try {
        const sql = "SELECT * FROM public.category ORDER BY category_name ASC";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        throw error;
    }
};