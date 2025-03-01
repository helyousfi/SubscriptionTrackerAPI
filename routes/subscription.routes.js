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

subscriptionRouter.get('/', authorize('moderator', 'admin', 'superadmin'), getSubscriptions);
subscriptionRouter.get('/:id', authorize('user', 'moderator', 'admin', 'superadmin'), getUserSubscriptions);
subscriptionRouter.post('/', authorize('user', 'moderator', 'admin', 'superadmin'), createSubscription);
subscriptionRouter.put('/:id', authorize('user', 'moderator', 'admin', 'superadmin') ,updateSubscription);
subscriptionRouter.delete('/:id', authorize('user', 'moderator', 'admin', 'superadmin'), deleteSubscription);
subscriptionRouter.get('/user/:id', authorize('user', 'moderator', 'admin', 'superadmin'), getSubscriptionsByUser);
subscriptionRouter.put('/:id/cancel', authorize('user', 'moderator', 'admin', 'superadmin'), cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);
subscriptionRouter.delete('/', authorize('superadmin'), deleteAllSubscriptions);

export default subscriptionRouter;