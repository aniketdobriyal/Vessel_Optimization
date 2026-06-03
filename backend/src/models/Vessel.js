import mongoose from 'mongoose';

const VesselSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    imo: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      default: 'Tanker'
    },
    dwt: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'In Port'
    },
    lat: {
      type: String,
      default: '00°00\'N'
    },
    lon: {
      type: String,
      default: '000°00\'E'
    },
    fuelRob: {
      type: Number,
      default: 0
    },
    speedScore: {
      type: Number,
      default: 90
    },
    fuelScore: {
      type: Number,
      default: 90
    },
    weatherScore: {
      type: Number,
      default: 90
    },
    overallScore: {
      type: Number,
      default: 90
    },
    owner: {
      type: String,
      default: ''
    },
    manager: {
      type: String,
      default: ''
    },
    capacity: {
      type: String,
      default: ''
    },
    grossTonnage: {
      type: String,
      default: ''
    },
    builtYear: {
      type: String,
      default: ''
    },
    flag: {
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
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('Vessel', VesselSchema);
