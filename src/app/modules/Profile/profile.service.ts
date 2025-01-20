import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';
import { UpdateUserInput } from '../User/user.interface';

// // update user first name and last name
// const updateUser = async (email: string, updates: UpdateUserInput) => {
//   // console.log(email);

//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   if ('password' in updates) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'updates are not allowed');
//   }

//   const { firstName, lastName } = updates;

//   const updatedUser = await prisma.user.update({
//     where: { email },
//     data: {
//       firstName: firstName || user.firstName,
//       lastName: lastName || user.lastName,
//     },
//     select: {
//       id: true,
//       email: true,
//       UserStatus: true,
//       profileImage: true,
//       createdAt: true,
//       updatedAt: true,
//       firstName: true,
//       lastName: true,
//     },
//   });

//   return updatedUser;
// };

const updateUserProfileImage = async (
  userId: string,
  profileImageUrl: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update user's profile image
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: profileImageUrl },
  });

  const { id, email, profileImage } = updatedUser;

  return { id, email, profileImage };
};

export const ProfileServices = {
  // updateUser,
  updateUserProfileImage,
};
