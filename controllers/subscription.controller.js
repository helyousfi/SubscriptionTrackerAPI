import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(
      { 
        success: true, 
        data: subscriptions 
      });
  }
  catch (error) {
    next(error);
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true});
      if(!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }
      res.status(200).json({
        success: true,
        data: subscription});
  }
  catch (error) {
    next(error);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try{
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if(!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}