import mongoose from 'mongoose';

const EOSPReportSchema = new mongoose.Schema(
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
    arrivalPosition: {
      type: String,
      default: ''
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
    distanceSailedTotal: {
      type: Number,
      default: 0
    },
    robArrival: {
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

export default mongoose.model('EOSPReport', EOSPReportSchema);
