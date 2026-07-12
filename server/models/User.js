import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    staffNumber: {
      type: String,
      required: [true, 'Staff number is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Staff number must be at least 3 characters'],
      maxlength: [20, 'Staff number must not exceed 20 characters'],
      match: [/^[a-zA-Z0-9]+$/, 'Staff number can only contain letters and numbers']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'QualityManager', 'DocumentController', 'DepartmentManager', 'Staff'],
        message: '{VALUE} is not a valid role'
      },
      default: 'Staff'
    },
    department: {
      type: String,
      enum: {
        values: ['General', 'ER', 'ICU', 'Lab', 'Pharmacy', 'Radiology', 'Nursing', 'HR'],
        message: '{VALUE} is not a valid department'
      },
      default: 'General'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);