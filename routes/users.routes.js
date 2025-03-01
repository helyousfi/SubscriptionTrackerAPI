import { Router } from "express";
import authorize from '../middlewares/authorization.middleware.js';

import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';;

const userRouter = Router();

userRouter.get('/', authorize('admin'), getUsers);
userRouter.get('/:id', authorize('user'), getUser);
userRouter.put('/:id', authorize('user'), updateUser);
userRouter.delete('/:id', authorize('user'), deleteUser);

export default userRouter;