import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { validateCommentBody, validateIdParam } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

// mergeParams is required to access the :id parameter from the parent route
const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.use(validateIdParam);

router.get('/', commentController.getComments);
router.post('/', validateCommentBody, commentController.createComment);

export default router;
