import { Router } from "express";
import authorize from '../middlewares/authorization.middleware.js';

import { getUsers, getUser, updateUser, deleteUser, deleteUserById } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', authorize('moderator', 'admin', 'superadmin'), getUsers);
userRouter.get('/:id', authorize('user', 'moderator', 'admin', 'superadmin'), getUser);
userRouter.put('/:id', authorize('user', 'moderator', 'admin', 'superadmin'), updateUser);
userRouter.delete('/:id', authorize('user', 'moderator', 'admin', 'superadmin'), deleteUserById);
userRouter.delete('/', authorize('user', 'moderator', 'admin', 'superadmin'), deleteUser);

export default userRouter;