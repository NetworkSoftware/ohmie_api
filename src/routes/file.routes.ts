import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'jobs');

router.get('/job/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(uploadsDir, filename);

    // Verify the resolved path is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
});

export default router;
