import e, { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { log } from 'console';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ message: 'Category created', data: category, success: true });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Create category failed', success: false });
    }
};

export const listCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryService.listCategories();
        res.status(200).json({ data: categories, message: 'Categories fetched successfully', success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'List categories failed', success: false });
    }
};
// get category by id can be added if needed, .
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        log(`Fetching category with ID: ${req.params.id}`);
        const category = await categoryService.getCategoryById(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ error: 'Category not found', success: false });
        }
        log(`Category fetched: ${category.name}`);
        res.status(200).json({ data: category, message: 'Category fetched successfully', success: true });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch category', success: false });
    }
}


// Additional category-related controller functions (update, delete) can be added here as needed

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.updateCategory(Number(req.params.id), req.body);
        res.status(200).json({ message: 'Category updated successfully', data: category, success: true });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Category update failed', success: false });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.deleteCategory(Number(req.params.id));
        res.status(200).json({ message: 'Category deleted successfully', success: true });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Category delete failed', success: false });
    }
};