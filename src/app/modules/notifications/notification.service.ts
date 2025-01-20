import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiErrors';
import admin from '../../../helpars/firebaseAdmin';

// get all notifications
const getNotifications = async (id: any) => {
  const notifications = await prisma.notifications.findMany({
    where: {
      receiverId: id,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (notifications.length === 0) {
    return [];
  }

  return notifications;
};

// get single notification
const getNotification = async (req: any, notificationId: string) => {
  const notification = await prisma.notifications.findUnique({
    where: {
      id: notificationId,
      receiverId: req.user.id,
    },
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found for the user');
  }

  await prisma.notifications.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return notification;
};

export const NotificationServices = {
  getNotifications,
  getNotification,
};
