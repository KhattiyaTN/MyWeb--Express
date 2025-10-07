import type { Request, Response, NextFunction } from 'express'
import { getProjectsService, createProjectService, updateProjectService, deleteProjectService } from '../services/projectService';

// GET
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID"})
        }

        const projects = await getProjectsService(userId);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// POST
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectData = req.body;
        const projectFiles = req.files as Express.Multer.File[] || [];

        if (!projectFiles.length) {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const project = await createProjectService(projectData, projectFiles);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const projectId = Number(id);
        const data = req.body
        const projectFiles = req.files as Express.Multer.File[] || [];

        if (isNaN(projectId)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const project = await updateProjectService(projectId, data, projectFiles);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

// DELETE
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const projectId = Number(id);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        await deleteProjectService(projectId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}