import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    voyageNumber: {
      type: String,
      required: true
    },
    vessel: {
      type: String,
      required: true
    },
    voyageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voyage'
    },
    vesselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel'
    },
    issue: {
      type: String,
      required: true
    },
    estLoss: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Open', 'Resolved'],
      default: 'Open'
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low'
    },
    time: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.voyageId) ret.voyageId = ret.voyageId.toString();
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
        if (ret.voyageId) ret.voyageId = ret.voyageId.toString();
        if (ret.vesselId) ret.vesselId = ret.vesselId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('Alert', AlertSchema);
