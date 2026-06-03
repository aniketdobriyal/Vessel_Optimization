import mongoose from 'mongoose';

const GeneratedReportSchema = new mongoose.Schema(
  {
    voyageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voyage',
      required: true
    },
    reportType: {
      type: String,
      default: 'Standard Performance Report'
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

export default mongoose.model('GeneratedReport', GeneratedReportSchema);
