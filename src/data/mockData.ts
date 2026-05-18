export interface Tutor {
  _id: string;
  tutorName: string;
  tutorImage: string;
  subject: string;
  availableTime: string;
  fee: number;
  totalSlot: number;
  sessionDate: string;
  institution: string;
  experience: string;
  location: string;
  teachingMode: 'Online' | 'Offline' | 'Both';
  createdByEmail: string;
  createdByName: string;
  createdAt: string;
  availableDays?: string;
  description?: string;
  rating?: number;
}

export interface Booking {
  _id: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
}

const TUTORS_KEY = 'mediqueue-tutors';
const BOOKINGS_KEY = 'mediqueue-bookings';

const defaultTutors: Tutor[] = [
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
    createdAt: '2025-01-01',
    description: 'Expert in calculus, algebra, and advanced mathematics. Helped 200+ students achieve top grades.',
    rating: 4.9,
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
    createdAt: '2025-01-02',
    description: 'Quantum physics and mechanics specialist with published research. Making complex concepts simple.',
    rating: 4.8,
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
    createdAt: '2025-01-03',
    description: 'Organic chemistry and biochemistry expert. Interactive teaching method with real-world examples.',
    rating: 4.7,
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
    createdAt: '2025-01-04',
    description: 'Full-stack development, algorithms, and AI/ML. Industry professional turned educator.',
    rating: 5.0,
  },
  {
    _id: 'tutor-5',
    tutorName: 'Dr. Emily Watson',
    tutorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    subject: 'Biology',
    availableTime: '8:00 AM - 12:00 PM',
    availableDays: 'Mon, Wed, Fri',
    fee: 70,
    totalSlot: 12,
    sessionDate: '2025-01-25',
    institution: 'Johns Hopkins University',
    experience: '7 years',
    location: 'Baltimore, USA',
    teachingMode: 'Offline',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: '2025-01-05',
    description: 'Molecular biology and genetics specialist. Passionate about making science accessible to everyone.',
    rating: 4.6,
  },
  {
    _id: 'tutor-6',
    tutorName: 'Mr. Lucas Thompson',
    tutorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    subject: 'English Literature',
    availableTime: '1:00 PM - 5:00 PM',
    availableDays: 'Tue, Thu, Sat',
    fee: 65,
    totalSlot: 15,
    sessionDate: '2025-01-15',
    institution: 'Yale University',
    experience: '9 years',
    location: 'New Haven, USA',
    teachingMode: 'Both',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: '2025-01-06',
    description: 'Literary analysis, creative writing, and academic essay specialist. Published author and educator.',
    rating: 4.8,
  },
  {
    _id: 'tutor-7',
    tutorName: 'Dr. Priya Sharma',
    tutorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    subject: 'Economics',
    availableTime: '10:00 AM - 2:00 PM',
    availableDays: 'Mon, Wed, Fri',
    fee: 80,
    totalSlot: 7,
    sessionDate: '2025-02-05',
    institution: 'London School of Economics',
    experience: '11 years',
    location: 'London, UK',
    teachingMode: 'Online',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: '2025-01-07',
    description: 'Macroeconomics, financial markets, and economic theory expert with consulting experience.',
    rating: 4.9,
  },
  {
    _id: 'tutor-8',
    tutorName: 'Prof. Michael Zhang',
    tutorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    subject: 'History',
    availableTime: '3:00 PM - 7:00 PM',
    availableDays: 'Tue, Thu',
    fee: 60,
    totalSlot: 20,
    sessionDate: '2025-01-10',
    institution: 'Oxford University',
    experience: '15 years',
    location: 'Oxford, UK',
    teachingMode: 'Both',
    createdByEmail: 'admin@mediqueue.com',
    createdByName: 'Admin',
    createdAt: '2025-01-08',
    description: 'World history, political science, and cultural studies expert. Engaging storytelling approach.',
    rating: 4.7,
  },
];

const defaultBookings: Booking[] = [];

export const getTutors = (): Tutor[] => {
  try {
    const stored = localStorage.getItem(TUTORS_KEY);
    if (!stored) {
      localStorage.setItem(TUTORS_KEY, JSON.stringify(defaultTutors));
      return defaultTutors;
    }
    return JSON.parse(stored);
  } catch {
    return defaultTutors;
  }
};

export const saveTutors = (tutors: Tutor[]): void => {
  localStorage.setItem(TUTORS_KEY, JSON.stringify(tutors));
};

export const addTutor = (tutor: Omit<Tutor, '_id' | 'createdAt' | 'rating'>): Tutor => {
  const tutors = getTutors();
  const newTutor: Tutor = {
    ...tutor,
    _id: `tutor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    rating: 4.5 + Math.random() * 0.5,
  };
  tutors.push(newTutor);
  saveTutors(tutors);
  return newTutor;
};

export const updateTutor = (id: string, updates: Partial<Tutor>): Tutor | null => {
  const tutors = getTutors();
  const idx = tutors.findIndex(t => t._id === id);
  if (idx === -1) return null;
  tutors[idx] = { ...tutors[idx], ...updates };
  saveTutors(tutors);
  return tutors[idx];
};

export const deleteTutor = (id: string): boolean => {
  const tutors = getTutors();
  const filtered = tutors.filter(t => t._id !== id);
  if (filtered.length === tutors.length) return false;
  saveTutors(filtered);
  return true;
};

export const getTutorById = (id: string): Tutor | null => {
  return getTutors().find(t => t._id === id) || null;
};

export const searchTutors = (query: string, subject?: string, startDate?: string, endDate?: string): Tutor[] => {
  let tutors = getTutors();
  
  if (query) {
    const q = query.toLowerCase();
    tutors = tutors.filter(t => 
      t.tutorName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.institution.toLowerCase().includes(q)
    );
  }
  
  if (subject && subject !== 'All') {
    tutors = tutors.filter(t => t.subject === subject);
  }
  
  if (startDate) {
    tutors = tutors.filter(t => t.sessionDate >= startDate);
  }
  
  if (endDate) {
    tutors = tutors.filter(t => t.sessionDate <= endDate);
  }
  
  return tutors;
};

export const getBookings = (): Booking[] => {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  } catch {
    return defaultBookings;
  }
};

export const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const addBooking = (booking: Omit<Booking, '_id'>): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    _id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  
  // Decrease slot count
  const tutors = getTutors();
  const tutor = tutors.find(t => t._id === booking.tutorId);
  if (tutor && tutor.totalSlot > 0) {
    tutor.totalSlot -= 1;
    saveTutors(tutors);
  }
  
  return newBooking;
};

export const cancelBooking = (id: string): boolean => {
  const bookings = getBookings();
  const booking = bookings.find(b => b._id === id);
  if (!booking) return false;
  
  booking.bookingStatus = 'cancelled';
  saveBookings(bookings);
  
  // Increase slot back
  const tutors = getTutors();
  const tutor = tutors.find(t => t._id === booking.tutorId);
  if (tutor) {
    tutor.totalSlot += 1;
    saveTutors(tutors);
  }
  
  return true;
};

export const getUserBookings = (email: string): Booking[] => {
  return getBookings().filter(b => b.studentEmail === email);
};

export const getUserTutors = (email: string): Tutor[] => {
  return getTutors().filter(t => t.createdByEmail === email);
};

export const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'English Literature', 'Economics',
  'History', 'Geography', 'Psychology', 'Philosophy',
  'Art & Design', 'Music', 'Physical Education', 'Statistics'
];

export const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'University Student',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'MediQueue completely transformed my learning experience. I went from failing calculus to getting an A+ thanks to Dr. Mitchell. The platform is incredibly intuitive and the tutors are world-class!',
  },
  {
    id: 2,
    name: 'Sophia Williams',
    role: 'High School Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'The booking system is seamless and the tutors are absolutely amazing. Prof. Chen made physics so much easier to understand. I highly recommend MediQueue to every student!',
  },
  {
    id: 3,
    name: 'Marcus Lee',
    role: 'Graduate Student',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Finding qualified tutors used to be a nightmare. MediQueue solved that completely. The interface is beautiful, the tutors are verified professionals, and the pricing is very reasonable.',
  },
  {
    id: 4,
    name: 'Emma Davis',
    role: 'Medical Student',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'As a busy medical student, I needed flexible scheduling. MediQueue delivered exactly that. The filter system helped me find the perfect tutor for biochemistry in minutes!',
  },
];
