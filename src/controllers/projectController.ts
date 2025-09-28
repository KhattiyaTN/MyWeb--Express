import type { Request, Response, NextFunction } from 'express'
import { getAllProjectService, createProjectService, updateProjectService, deleteProjectService } from '../services/projectService';

// GET
export const getAllProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID"})
        }

        const projects = await getAllProjectService(userId);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// POST
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const project = await createProjectService(data);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

// PATCH
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const data = req.body
        const projectId = Number(id);

        if (isNaN(projectId)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const project = await updateProjectService(projectId, data);
        res.status(201).json(project);
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