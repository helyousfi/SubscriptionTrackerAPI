import { Router } from "express";
import { createSubscription, 
    getUserSubscriptions, 
    getSubscriptions, 
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUser,
    cancelSubscription,
    getUpcomingRenewals,
    deleteAllSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/authorization.middleware.js";
import authorizeAdmin from "../middlewares/adminAuth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorizeAdmin, getSubscriptions);
subscriptionRouter.get('/:id', authorize, getUserSubscriptions);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize ,updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getSubscriptionsByUser);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.delete('/', authorizeAdmin, deleteAllSubscriptions);

export default subscriptionRouter;