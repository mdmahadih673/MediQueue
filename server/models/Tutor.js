import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  tutorName: { type: String, required: true },
  tutorImage: { type: String, required: true },
  subject: { type: String, required: true },
  availableTime: { type: String, required: true },
  availableDays: { type: String },
  fee: { type: Number, required: true },
  totalSlot: { type: Number, required: true, min: 0 },
  sessionDate: { type: String, required: true }, // YYYY-MM-DD
  institution: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  teachingMode: { type: String, enum: ['Online', 'Offline', 'Both'], required: true },
  description: { type: String },
  createdByEmail: { type: String, required: true },
  createdByName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TutorModel = mongoose.model('Tutor', tutorSchema);

// Initial seed tutors to wow the user immediately!
const seedTutors = [
  {
    _id: 'tutor-1',
    tutorName: 'Dr. Sarah Mitchell',
    tutorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    subject: 'Mathematics',
    availableTime: '9:00 AM - 12:00 PM',
    availableDays: 'Mon, Wed, Fri',
    fee: 85,
    totalSlot: 8,
    sessionDate: '2025-02-15',
    institution: 'MIT',
    experience: '8 years',
    location: 'New York, USA',
    teachingMode: 'Both',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: new Date('2025-01-01'),
    description: 'Expert in calculus, algebra, and advanced mathematics. Helped 200+ students achieve top grades.',
  },
  {
    _id: 'tutor-2',
    tutorName: 'Prof. James Chen',
    tutorImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
    subject: 'Physics',
    availableTime: '2:00 PM - 6:00 PM',
    availableDays: 'Tue, Thu, Sat',
    fee: 90,
    totalSlot: 6,
    sessionDate: '2025-02-10',
    institution: 'Stanford University',
    experience: '12 years',
    location: 'San Francisco, USA',
    teachingMode: 'Online',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: new Date('2025-01-02'),
    description: 'Quantum physics and mechanics specialist with published research. Making complex concepts simple.',
  },
  {
    _id: 'tutor-3',
    tutorName: 'Ms. Aisha Patel',
    tutorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    subject: 'Chemistry',
    availableTime: '10:00 AM - 2:00 PM',
    availableDays: 'Mon, Tue, Thu',
    fee: 75,
    totalSlot: 10,
    sessionDate: '2025-01-20',
    institution: 'Harvard University',
    experience: '6 years',
    location: 'Boston, USA',
    teachingMode: 'Both',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: new Date('2025-01-03'),
    description: 'Organic chemistry and biochemistry expert. Interactive teaching method with real-world examples.',
  },
  {
    _id: 'tutor-4',
    tutorName: 'Mr. David Rodriguez',
    tutorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    subject: 'Computer Science',
    availableTime: '4:00 PM - 8:00 PM',
    availableDays: 'Wed, Fri, Sat',
    fee: 100,
    totalSlot: 5,
    sessionDate: '2025-02-01',
    institution: 'Carnegie Mellon University',
    experience: '10 years',
    location: 'Pittsburgh, USA',
    teachingMode: 'Online',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: new Date('2025-01-04'),
    description: 'Full-stack development, algorithms, and AI/ML. Industry professional turned educator.',
  }
];

const memoryTutors = [...seedTutors];

const makeTutorInstance = (data) => {
  const instance = { ...data };
  
  instance.save = async function() {
    const idx = memoryTutors.findIndex(t => t._id.toString() === this._id.toString());
    if (idx !== -1) {
      memoryTutors[idx] = { ...memoryTutors[idx], ...this };
    }
    return this;
  };
  
  instance.deleteOne = async function() {
    const idx = memoryTutors.findIndex(t => t._id.toString() === this._id.toString());
    if (idx !== -1) {
      memoryTutors.splice(idx, 1);
    }
    return { deletedCount: 1 };
  };
  
  return instance;
};

const TutorFallback = {
  find: (query = {}) => {
    if (!global.isMockDB) {
      return TutorModel.find(query);
    }
    console.log('⚡ [MockDB] Tutor.find called with', query);
    
    let results = [...memoryTutors];
    
    // Filtering logic
    if (query.tutorName && query.tutorName.$regex) {
      const regex = new RegExp(query.tutorName.$regex, 'i');
      results = results.filter(t => regex.test(t.tutorName));
    }
    
    if (query.subject) {
      results = results.filter(t => t.subject === query.subject);
    }
    
    if (query.createdByEmail) {
      results = results.filter(t => t.createdByEmail === query.createdByEmail);
    }
    
    if (query.teachingMode && query.teachingMode !== 'All') {
      results = results.filter(t => t.teachingMode === query.teachingMode);
    }
    
    if (query.sessionDate) {
      if (query.sessionDate.$gte) {
        results = results.filter(t => t.sessionDate >= query.sessionDate.$gte);
      }
      if (query.sessionDate.$lte) {
        results = results.filter(t => t.sessionDate <= query.sessionDate.$lte);
      }
    }
    
    // Sort by createdAt descending
    results.sort((a, b) => b.createdAt - a.createdAt);
    
    // Prepare chain for Mongoose limit/sort
    const chain = {
      sort: () => chain,
      limit: (n) => {
        results = results.slice(0, n);
        return chain;
      },
      then: (resolve) => {
        resolve(results.map(makeTutorInstance));
      },
      catch: (reject) => {}
    };
    
    // Make results look like array with additional chain methods
    const responseArray = results.map(makeTutorInstance);
    responseArray.sort = () => chain;
    responseArray.limit = (n) => {
      const sliced = responseArray.slice(0, n);
      sliced.sort = () => sliced;
      sliced.limit = () => sliced;
      sliced.then = (resolve) => resolve(sliced);
      return sliced;
    };
    
    return responseArray;
  },
  
  findById: async (id) => {
    if (!global.isMockDB) {
      return TutorModel.findById(id);
    }
    console.log('⚡ [MockDB] Tutor.findById called with', id);
    const tutor = memoryTutors.find(t => t._id.toString() === id.toString());
    return tutor ? makeTutorInstance(tutor) : null;
  },
  
  create: async (data) => {
    if (!global.isMockDB) {
      return TutorModel.create(data);
    }
    console.log('⚡ [MockDB] Tutor.create called with', data);
    const newTutor = {
      ...data,
      _id: `tutor-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date()
    };
    memoryTutors.push(newTutor);
    return makeTutorInstance(newTutor);
  }
};

export default TutorFallback;
