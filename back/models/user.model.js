const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema(
  {
    prenom: { 
      type: String, 
      required: true 
    },   
		avatar: { 
      type: String, 
      default: 'picture',
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    isActive: {
      type: Boolean,
      required : true, 
    }, 
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String, 
      enum: ['user', 'admin', 'superAdmin'],
      default: 'user',
    }
  },
  { timestamps: { createdAt: true } }
)

userSchema.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('User', userSchema);
