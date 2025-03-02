import { Router } from "express";
import { signup, 
    signin, 
    signout, 
    confirmUser,
    requestPasswordReset,
    resetPassword } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signup);
authRouter.post('/sign-in', signin);
authRouter.post('/sign-out', signout);
authRouter.get('/confirm', confirmUser);
authRouter.post('/request-password-reset', requestPasswordReset);
authRouter.post('/reset-password', resetPassword);

export default authRouter;