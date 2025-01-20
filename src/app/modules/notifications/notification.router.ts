import express from 'express';
import { notificationControllers } from './notification.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Get all notifications
router.get('/', auth(), notificationControllers.getNotifications);

// get single notification
router.get('/:notificationId', auth(), notificationControllers.getNotification);

export const notificationsRoutes = router;
