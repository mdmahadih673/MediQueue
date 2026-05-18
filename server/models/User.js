import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photoURL: { type: String },
  passwordHash: { type: String }, // Used in local fallback auth
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', userSchema);

// In-memory fallback database
const memoryUsers = [];

const UserFallback = {
  findOne: async (query) => {
    if (!global.isMockDB) {
      return UserModel.findOne(query);
    }
    console.log('⚡ [MockDB] User.findOne called with', query);
    const found = memoryUsers.find(u => {
      if (query.email) return u.email === query.email;
      if (query.uid) return u.uid === query.uid;
      return false;
    });
    if (!found) return null;
    
    // Emulate save method
    return {
      ...found,
      save: async function() {
        const idx = memoryUsers.findIndex(u => u.uid === this.uid);
        if (idx !== -1) {
          memoryUsers[idx] = { ...memoryUsers[idx], ...this };
        }
        return this;
      }
    };
  },
  
  create: async (data) => {
    if (!global.isMockDB) {
      return UserModel.create(data);
    }
    console.log('⚡ [MockDB] User.create called with', data);
    const newUser = {
      ...data,
      _id: `user-${Date.now()}`,
      createdAt: new Date()
    };
    
    newUser.save = async function() {
      const idx = memoryUsers.findIndex(u => u.uid === this.uid);
      if (idx !== -1) {
        memoryUsers[idx] = { ...memoryUsers[idx], ...this };
      }
      return this;
    };
    
    memoryUsers.push(newUser);
    return newUser;
  },

  find: async (query = {}) => {
    if (!global.isMockDB) {
      return UserModel.find(query);
    }
    console.log('⚡ [MockDB] User.find called with', query);
    return memoryUsers;
  }
};

export default UserFallback;
