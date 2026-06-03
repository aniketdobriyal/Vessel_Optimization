import mongoose from 'mongoose';

const RouteOptimizationSchema = new mongoose.Schema(
  {
    voyageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voyage',
      required: true
    },
    routeA: {
      type: String,
      default: ''
    },
    routeB: {
      type: String,
      default: ''
    },
    distanceA: {
      type: Number,
      default: 0
    },
    distanceB: {
      type: Number,
      default: 0
    },
    distanceComparison: {
      type: Number,
      default: 0
    },
    fuelA: {
      type: Number,
      default: 0
    },
    fuelB: {
      type: Number,
      default: 0
    },
    fuelComparison: {
      type: Number,
      default: 0
    },
    etaA: {
      type: String,
      default: ''
    },
    etaB: {
      type: String,
      default: ''
    },
    etaComparison: {
      type: Number,
      default: 0
    },
    recommendationReason: {
      type: String,
      default: ''
    },
    // Enhanced fields for Route Optimization completeness
    weatherImpactA: {
      type: String,
      default: 'Low Risk (Beaufort 2-4)'
    },
    weatherImpactB: {
      type: String,
      default: 'Moderate Risk (Beaufort 5-6)'
    },
    fuelSaving: {
      type: Number,
      default: 0
    },
    isDiversionRecommended: {
      type: Boolean,
      default: false
    },
    diversionDetails: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.voyageId) ret.voyageId = ret.voyageId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.voyageId) ret.voyageId = ret.voyageId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('RouteOptimization', RouteOptimizationSchema);
