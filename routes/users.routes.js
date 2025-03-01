import { Router } from "express";
import authorize from '../middlewares/authorization.middleware.js';

import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';;

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.put('/:id', authorize, updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;