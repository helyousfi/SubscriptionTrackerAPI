import { Router } from "express";
import { createSubscription, 
    getUserSubscriptions, 
    getSubscriptions, 
    updateSubscription,
    deleteSubscription,
    getSubscriptionsByUser } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/authorization.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', getSubscriptions);
subscriptionRouter.get('/:id', authorize, getUserSubscriptions);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize ,updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getSubscriptionsByUser);
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title : 'CANCEL subscriptions'}));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title : 'GET upcoming renewals'}));

export default subscriptionRouter;