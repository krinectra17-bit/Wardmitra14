import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    // Return null without throwing so the app can use fallback storage in dev if needed
    return null;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('MongoDB connection error:', e);
    return null;
  }

  return cached!.conn;
}

/**
 * In-memory / file fallback store for local testing when MONGODB_URI is not set.
 * This guarantees the developer and reviewers can submit and view issues immediately.
 */
export interface FallbackIssue {
  _id: string;
  referenceId: string;
  name?: string;
  mobile?: string;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: 'नई समस्या' | 'जांच में' | 'संबंधित विभाग को सूचित' | 'समाधान हुआ';
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FallbackFeedback {
  _id: string;
  name?: string;
  mobile?: string;
  response: string;
  message?: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryIssues: FallbackIssue[] | undefined;
  // eslint-disable-next-line no-var
  var memoryFeedback: FallbackFeedback[] | undefined;
}

if (!global.memoryIssues) {
  global.memoryIssues = [
    {
      _id: 'sample-1',
      referenceId: 'WARD14-729104',
      name: 'रमेश कुमार',
      mobile: '9876543210',
      category: 'स्ट्रीट लाइट',
      description: 'गली नंबर 3 के मोड़ पर स्ट्रीट लाइट विगत 4 दिनों से बंद है, जिससे रात में आवागमन में परेशानी हो रही है।',
      location: 'गली नं. 3, दाधीच वाटिका के पास',
      status: 'जांच में',
      internalNotes: 'वार्ड बिजली विंग को निरीक्षण हेतु प्रेषित किया गया।',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'sample-2',
      referenceId: 'WARD14-381920',
      name: 'सुनीता शर्मा',
      mobile: '9823456789',
      category: 'स्वच्छता',
      description: 'मुख्य मार्ग के पास नियमित कचरा उठान नहीं हो पा रहा है। कृपया वाहन फेरे सुनिश्चित करें।',
      location: 'मेन मार्केट रोड, वार्ड 14',
      status: 'संबंधित विभाग को सूचित',
      internalNotes: 'सफाई निरीक्षक से बात की गई है, कल सुबह विशेष अभियान।',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];
}

if (!global.memoryFeedback) {
  global.memoryFeedback = [
    {
      _id: 'feedback-1',
      name: 'अमित दाधीच',
      mobile: '9811122334',
      response: 'मैं समर्थन के संबंध में अपनी सहमति दर्ज करना चाहता/चाहती हूँ।',
      message: 'वार्ड 14 में निष्पक्ष विकास और नागरिक सहायता के लिए शुभकामनाएं।',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
}

export const memoryStore = {
  getIssues: () => global.memoryIssues || [],
  addIssue: (issue: FallbackIssue) => {
    global.memoryIssues = [issue, ...(global.memoryIssues || [])];
    return issue;
  },
  findIssueByRef: (ref: string) => {
    return (global.memoryIssues || []).find((i) => i.referenceId.toUpperCase() === ref.toUpperCase());
  },
  updateIssue: (id: string, updates: Partial<FallbackIssue>) => {
    const list = global.memoryIssues || [];
    const index = list.findIndex((i) => i._id === id || i.referenceId === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      return list[index];
    }
    return null;
  },
  deleteIssue: (id: string) => {
    global.memoryIssues = (global.memoryIssues || []).filter((i) => i._id !== id && i.referenceId !== id);
    return true;
  },
  getFeedback: () => global.memoryFeedback || [],
  addFeedback: (fb: FallbackFeedback) => {
    global.memoryFeedback = [fb, ...(global.memoryFeedback || [])];
    return fb;
  }
};
