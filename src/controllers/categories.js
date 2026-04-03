// Import any needed model functions
import { getAllCategories, 
    getCategoryDetails, 
    getProjectsByCategory, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments, } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
import * as categoryModel from '../models/categories.js';


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

    if (!category) return next();

    res.render('category-detail', { 
        title: category.category_name, 
        category, 
        projects 
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};


// 1. Validation Rules
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters.')
];

// 2. Show New Form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

// 3. Process New Form
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    const { categoryName } = req.body;
    await categoryModel.createCategory(categoryName);
    req.flash('success', 'Category created!');
    res.redirect('/categories');
};

// 4. Show Edit Form
const showEditCategoryForm = async (req, res) => {
    const category = await categoryModel.getCategoryById(req.params.id);
    res.render('edit-category', { title: 'Edit Category', category });
};

// 5. Process Edit Form
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    const categoryId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    await categoryModel.updateCategory(categoryId, req.body.categoryName);
    req.flash('success', 'Category updated!');
    res.redirect('/categories');
};

// Export any controller functions
export { showCategoryDetailsPage, 
    showCategoriesPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    categoryValidation, 
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm

};