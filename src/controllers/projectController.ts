import type { Request, Response, NextFunction } from 'express'
import { uploadFileToS3 } from '../services/aws/uploadService';
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

        let imageUrls: string[] = [];

        if (projectFiles.length > 0) {
            const uploadResults = await Promise.allSettled(
                projectFiles.map(file => uploadFileToS3(file))
            );

            const successfulUploads = uploadResults
                .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
                .map(result => result.value);

            const failedUploads = uploadResults
                .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
                .map(result => result.reason?.message || 'Unknown error');

            if (successfulUploads.length === 0) {
                return res.status(400).json({
                    message: 'Failed to upload any images',
                    errors: failedUploads,
                });
            }
        } else if (typeof req.body.imageUrl === 'string' && req.body.imageUrl) {
            imageUrls = [req.body.imageUrl];
        } else {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const project = await createProjectService( projectData, imageUrls );
        
        res.status(201).json(project);
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