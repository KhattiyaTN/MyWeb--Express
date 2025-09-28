import type { Request, Response } from 'express'
import { getAllProjectService, createProjectService, updateProjectService, deleteProjectService } from '../services/projectService';

// GET
export const getAllProject = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = Number(id);

    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID"})
    }

    const projects = await getAllProjectService(userId);
    res.status(200).json(projects);
};

// POST
export const createProject = async (req: Request, res: Response) => {
    const data = req.body
    const project = await createProjectService(data);
    res.status(200).json(project);
}

// PATCH
export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
    const projectId = Number(id);

    if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await updateProjectService(projectId, data);
    res.status(201).json(project);
}

// DELETE
export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params
    const projectId = Number(id);

    if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
    }

    await deleteProjectService(projectId);
    res.status(204).send()
}