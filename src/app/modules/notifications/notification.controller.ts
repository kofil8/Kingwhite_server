import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { NotificationServices } from './notification.service';
import ApiError from '../../../errors/ApiErrors';

// get all notifications
const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await NotificationServices.getNotifications(
    req.user.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'notifications retrieved successfully',
    data: notifications,
  });
});

// get single notification
const getNotification = catchAsync(async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const notification = await NotificationServices.getNotification(
    req,
    notificationId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'notification retrieved successfully',
    data: notification,
  });
});

export const notificationControllers = {
  getNotifications,
  getNotification,
};
