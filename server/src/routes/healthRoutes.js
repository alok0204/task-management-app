import { Router } from 'express';
import { db } from '../db/prisma.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    application: 'TaskFlow API — Thiranex Task 2',
    developer: 'Alok Kumar Vishwas',
    database: db.isPostgres() ? 'PostgreSQL (Prisma Connected)' : 'Persistent Local Storage Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
