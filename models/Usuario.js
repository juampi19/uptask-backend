import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'


const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,

  },
  token: {
    type: String
  },
  confirmado: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true,
  });


usuarioSchema.pre('save', async function (next) {
  //Si estoy modificando algo que no sea el password usamos el next
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;