import express from 'express';
import {
  getStats,
  getRecent,
  searchDocuments,
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  addVersion,
  getVersions
} from '../controllers/documentController.js';
import { verifyToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// مسارات عامة (تتطلب مصادقة فقط)
router.get('/stats', verifyToken, getStats);
router.get('/recent', verifyToken, getRecent);
router.get('/search', verifyToken, searchDocuments);

// مسارات تتطلب صلاحيات إضافية
router.post('/', verifyToken, authorize('Admin', 'DocumentController', 'QualityManager'), createDocument);
router.get('/', verifyToken, getAllDocuments);
router.get('/:id', verifyToken, getDocumentById);
router.put('/:id', verifyToken, authorize('Admin', 'DocumentController', 'QualityManager'), updateDocument);
router.delete('/:id', verifyToken, authorize('Admin'), deleteDocument);

// مسارات الإصدارات
router.post('/:id/versions', verifyToken, authorize('Admin', 'DocumentController', 'QualityManager'), addVersion);
router.get('/:id/versions', verifyToken, getVersions);

export default router;