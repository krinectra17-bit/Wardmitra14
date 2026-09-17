import mongoose, { Schema, Document, Model } from 'mongoose';

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved' | 'नई समस्या' | 'जांच में' | 'संबंधित विभाग को सूचित' | 'समाधान हुआ';

export interface IIssue extends Document {
  referenceId: string;
  citizenName?: string;
  name?: string;
  mobile?: string;
  category: string;
  description: string;
  location: string;
  photoUrl?: string;
  imageUrl?: string;
  status: IssueStatus;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    citizenName: {
      type: String,
      trim: true,
      default: 'नागरिक',
    },
    name: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'समस्या की श्रेणी आवश्यक है'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'समस्या का विवरण आवश्यक है'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'स्थान अथवा क्षेत्र आवश्यक है'],
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'नई समस्या', 'जांच में', 'संबंधित विभाग को सूचित', 'समाधान हुआ'],
      default: 'Pending',
      index: true,
    },
    internalNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound and individual indexes for performant querying
IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ status: 1, createdAt: -1 });
IssueSchema.index({ category: 1, createdAt: -1 });

// Prevent re-compilation of model during hot-reloading or serverless invocations
export const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);
