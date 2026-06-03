import mongoose from 'mongoose';

const PortNoonReportSchema = new mongoose.Schema(
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
    utcTime: {
      type: String,
      default: ''
    },
    portName: {
      type: String,
      default: ''
    },
    vesselCondition: {
      type: String,
      enum: ['Laden', 'Ballast'],
      default: 'Laden'
    },
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
    // Fuel Consumptions
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
    fuelConsumed: {
      type: Number,
      default: 0
    },
    fuelReceived: {
      type: Number,
      default: 0
    },
    // Fuel ROBs
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
    robFuel: {
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
    // Auxiliary Engines Utilisation
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

export default mongoose.model('PortNoonReport', PortNoonReportSchema);
