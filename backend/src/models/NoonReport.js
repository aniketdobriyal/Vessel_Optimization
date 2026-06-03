import mongoose from 'mongoose';

const NoonReportSchema = new mongoose.Schema(
  {
    voyageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voyage',
      required: true
    },
    date: {
      type: String,
      default: ''
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    },
    distanceSailed: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 0
    },
    rpm: {
      type: Number,
      default: 0
    },
    slip: {
      type: Number,
      default: 0
    },
    windSpeed: {
      type: Number,
      default: 0
    },
    windDir: {
      type: String,
      default: ''
    },
    windDirection: {
      type: String,
      default: ''
    },
    currentSpeed: {
      type: Number,
      default: 0
    },
    currentDir: {
      type: String,
      default: ''
    },
    currentDirection: {
      type: String,
      default: ''
    },
    swellDirection: {
      type: String,
      default: ''
    },
    beaufortScale: {
      type: Number,
      default: 0
    },
    waveHeight: {
      type: Number,
      default: 0
    },
    fuelConsumed: {
      type: Number,
      default: 0
    },
    robFuel: {
      type: Number,
      default: 0
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
    // Lube Oil Monitoring
    meCylinderOilRob: {
      type: Number,
      default: 0
    },
    cylinderOilConsumption: {
      type: Number,
      default: 0
    },
    meSystemOilRob: {
      type: Number,
      default: 0
    },
    meSystemOilConsumption: {
      type: Number,
      default: 0
    },
    aeLoRob: {
      type: Number,
      default: 0
    },
    aeLoConsumption: {
      type: Number,
      default: 0
    },
    // Fresh Water Monitoring
    fwGenerated: {
      type: Number,
      default: 0
    },
    fwConsumed: {
      type: Number,
      default: 0
    },
    fwReceived: {
      type: Number,
      default: 0
    },
    fwRob: {
      type: Number,
      default: 0
    },
    // Auxiliary Engine Utilization
    ae1Hours: {
      type: Number,
      default: 0
    },
    ae2Hours: {
      type: Number,
      default: 0
    },
    ae3Hours: {
      type: Number,
      default: 0
    },
    // Detailed Fuel Tracking
    meHsfoConsumed: {
      type: Number,
      default: 0
    },
    meLsfoConsumed: {
      type: Number,
      default: 0
    },
    meMgoConsumed: {
      type: Number,
      default: 0
    },
    aeHsfoConsumed: {
      type: Number,
      default: 0
    },
    aeLsfoConsumed: {
      type: Number,
      default: 0
    },
    aeMgoConsumed: {
      type: Number,
      default: 0
    },
    boilerHsfoConsumed: {
      type: Number,
      default: 0
    },
    boilerLsfoConsumed: {
      type: Number,
      default: 0
    },
    boilerMgoConsumed: {
      type: Number,
      default: 0
    },
    robHsfo: {
      type: Number,
      default: 0
    },
    robLsfo: {
      type: Number,
      default: 0
    },
    robMgo: {
      type: Number,
      default: 0
    },
    // Noon Position Report Template Gaps
    utcTime: {
      type: String,
      default: ''
    },
    vesselCondition: {
      type: String,
      enum: ['Laden', 'Ballast'],
      default: 'Laden'
    },
    lastPort: {
      type: String,
      default: ''
    },
    nextPort: {
      type: String,
      default: ''
    },
    distanceToNextPort: {
      type: Number,
      default: 0
    },
    engineDistance: {
      type: Number,
      default: 0
    },
    distanceSailedFromCosp: {
      type: Number,
      default: 0
    },
    steamingTimeDaily: {
      type: Number,
      default: 0
    },
    steamingTimeAfterCosp: {
      type: Number,
      default: 0
    },
    allowedCpSpeed: {
      type: Number,
      default: 0
    },
    averageSpeed: {
      type: Number,
      default: 0
    },
    eta: {
      type: String,
      default: ''
    },
    fuelReceived: {
      type: Number,
      default: 0
    },
    remarks: {
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

export default mongoose.model('NoonReport', NoonReportSchema);
