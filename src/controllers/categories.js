// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsByCategory } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res, next) => {
    const id = req.params.id;
    const category = await getCategoryDetails(id);
    const projects = await getProjectsByCategory(id);

    res.render('category', { 
        title: category.category_name, 
        category, 
        projects 
    });
};

// Export any controller functions
export { showCategoryDetailsPage, showCategoriesPage };