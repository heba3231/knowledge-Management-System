import mongoose from 'mongoose';

const VersionSchema = new mongoose.Schema({
  versionNumber: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  changeNotes: { type: String },
});

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  docNumber: { type: String, unique: true },
  category: {
    type: String,
    enum: ['Protocol', 'Policy', 'Guide', 'SOP'],
    default: 'Protocol'
  },
  department: {
    type: String,
    enum: ['ER', 'ICU', 'Lab', 'Pharmacy', 'HR', 'General'],
    default: 'General'
  },
  description: { type: String },
  keywords: [String],
  status: {
    type: String,
    enum: ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Published', 'Archived'],
    default: 'Draft'
  },
  versions: [VersionSchema],
  reviewDate: { type: Date },
  expiryDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);