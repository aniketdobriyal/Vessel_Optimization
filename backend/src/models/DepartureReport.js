import mongoose from 'mongoose';

const DepartureReportSchema = new mongoose.Schema(
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
    departurePlace: {
      type: String,
      default: 'Berth'
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
    // Cargo Details
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
    // ROBs on Departure
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
    meCylinderOilRob: {
      type: Number,
      default: 0
    },
    meSystemOilRob: {
      type: Number,
      default: 0
    },
    aeLoRob: {
      type: Number,
      default: 0
    },
    fwRob: {
      type: Number,
      default: 0
    },
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
    nextPort: {
      type: String,
      default: ''
    },
    allowedCpSpeed: {
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

export default mongoose.model('DepartureReport', DepartureReportSchema);
