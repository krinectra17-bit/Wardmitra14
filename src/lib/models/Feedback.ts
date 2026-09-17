import mongoose, { Schema, Document, Model } from 'mongoose';

export type FeedbackOption =
  | 'मैं समर्थन के संबंध में अपनी सहमति दर्ज करना चाहता/चाहती हूँ।'
  | 'मैं अपनी राय या सुझाव साझा करना चाहता/चाहती हूँ।'
  | 'मैं अभी कोई राय दर्ज नहीं करना चाहता/चाहती हूँ।';

export interface IFeedback extends Document {
  name?: string;
  mobile?: string;
  response: FeedbackOption;
  message?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      trim: true,
      default: 'नागरिक',
    },
    mobile: {
      type: String,
      trim: true,
    },
    response: {
      type: String,
      required: [true, 'प्रतिक्रिया विकल्प आवश्यक है'],
      enum: [
        'मैं समर्थन के संबंध में अपनी सहमति दर्ज करना चाहता/चाहती हूँ।',
        'मैं अपनी राय या सुझाव साझा करना चाहता/चाहती हूँ।',
        'मैं अभी कोई राय दर्ज नहीं करना चाहता/चाहती हूँ।',
      ],
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
