import mongoose, { Schema, Document, Model } from 'mongoose';

export type IssueStatus = 'नई समस्या' | 'जांच में' | 'संबंधित विभाग को सूचित' | 'समाधान हुआ';

export interface IIssue extends Document {
  referenceId: string;
  name?: string;
  mobile?: string;
  category: string;
  description: string;
  location: string;
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
    },
    name: {
      type: String,
      trim: true,
      default: 'गुमनाम नागरिक',
    },
    mobile: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'समस्या की श्रेणी आवश्यक है'],
      trim: true,
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
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['नई समस्या', 'जांच में', 'संबंधित विभाग को सूचित', 'समाधान हुआ'],
      default: 'नई समस्या',
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

// Prevent re-compilation of model during hot-reloading
export const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);
