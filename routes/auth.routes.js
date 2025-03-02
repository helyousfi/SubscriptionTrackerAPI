import { Router } from "express";
import { signup, signin, signout, confirmUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signup);
authRouter.post('/sign-in', signin);
authRouter.post('/sign-out', signout);
authRouter.get('/confirm', confirmUser);
export default authRouter;