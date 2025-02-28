import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minlength: [2, "Subscription name must be at least 3 characters long"],
        maxlength: [50, "Subscription name must be at most 50 characters long"]
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"]
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY'],
        required: true,
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    category: {
        type: String,
        enum: ['entertainment', 'education', 'health', 'utility', 'other']
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'other'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;;
            },
            message: 'Renewal date must be in the future'
        }
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate)
    {
        const renewalPeriods = {daily: 1, weekly: 7, monthly: 30, yearly: 365};
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    } 
    if(this.renewalDate < new Date())
    {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;