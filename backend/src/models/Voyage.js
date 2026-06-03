import mongoose from 'mongoose';

const VoyageSchema = new mongoose.Schema(
  {
    voyageNumber: {
      type: String,
      required: true
    },
    vesselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true
    },
    vesselName: {
      type: String,
      required: true
    },
    departurePort: {
      type: String,
      default: ''
    },
    destinationPort: {
      type: String,
      default: ''
    },
    cpSpeed: {
      type: Number,
      required: true
    },
    cpConsumption: {
      type: Number,
      required: true
    },
    departureDate: {
      type: String,
      default: ''
    },
    eta: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active'
    },
    distanceTotal: {
      type: Number,
      default: 0
    },
    distanceSailed: {
      type: Number,
      default: 0
    },
    fuelPrice: {
      type: Number,
      default: 650
    },
    charterRate: {
      type: Number,
      default: 18000
    },
    // Draft & Displacement Data
    draftForward: {
      type: Number,
      default: 0
    },
    draftMid: {
      type: Number,
      default: 0
    },
    draftAft: {
      type: Number,
      default: 0
    },
    displacement: {
      type: Number,
      default: 0
    },
    constant: {
      type: Number,
      default: 0
    },
    // Cargo Information
    cargoDescription: {
      type: String,
      default: ''
    },
    cargoQuantity: {
      type: Number,
      default: 0
    },
    billOfLadingQuantity: {
      type: Number,
      default: 0
    },
    cargoRemarks: {
      type: String,
      default: ''
    },
    // Claims inputs/metrics
    goodWeatherDays: {
      type: Number,
      default: 0
    },
    speedDeficit: {
      type: Number,
      default: 0
    },
    fuelOverconsumptionCost: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Keep vesselId as string if it is an objectId
        if (ret.vesselId) ret.vesselId = ret.vesselId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.vesselId) ret.vesselId = ret.vesselId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('Voyage', VoyageSchema);
