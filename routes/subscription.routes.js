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

subscriptionRouter.get('/', authorize('admin'), getSubscriptions);
subscriptionRouter.get('/:id', authorize('user'), getUserSubscriptions);
subscriptionRouter.post('/', authorize('user'), createSubscription);
subscriptionRouter.put('/:id', authorize('user') ,updateSubscription);
subscriptionRouter.delete('/:id', authorize('user'), deleteSubscription);
subscriptionRouter.get('/user/:id', authorize('user'), getSubscriptionsByUser);
subscriptionRouter.put('/:id/cancel', authorize('user'), cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.delete('/', authorize('admin'), deleteAllSubscriptions);

export default subscriptionRouter;