const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROLES = ['client', 'freelancer', 'admin'];
// Roles a person may pick when signing up. Admins are created with the seed script only.
const SELF_REGISTER_ROLES = ['client', 'freelancer'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'client' },
  },
  { timestamps: true }
);

// Hash the password before saving (only when it changed)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never send the password hash or internal fields back in API responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
module.exports.SELF_REGISTER_ROLES = SELF_REGISTER_ROLES;
