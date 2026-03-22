import prisma from '../utils/prisma';

export const createCategory = async (data: { name: string }) => {
    const { name } = data;
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) throw { status: 409, message: 'Category already exists' };
    return prisma.category.create({ data: { name } });
};

export const listCategories = async () => {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
};
export const getCategoryById = async (id: number) => {
    return prisma.category.findUnique({ where: { id } });
}

export const updateCategory = async (id: number, data: { name: string }) => {
    const { name } = data;
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists && exists.id !== id) throw { status: 409, message: 'Category name already exists' };
    return prisma.category.update({ where: { id }, data: { name } });
};

export const deleteCategory = async (id: number) => {
    return prisma.category.update({ where: { id }, data: { isActive: false } });
};
