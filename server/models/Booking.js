import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  tutorName: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, required: true },
  bookingStatus: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['bKash', 'Nagad', 'Rocket'], required: true },
  transactionId: { type: String, required: true },
  paymentScreenshot: { type: String }
});

const BookingModel = mongoose.model('Booking', bookingSchema);

// In-memory bookings database
const memoryBookings = [];

const makeBookingInstance = (data) => {
  const instance = { ...data };
  
  instance.save = async function() {
    const idx = memoryBookings.findIndex(b => b._id.toString() === this._id.toString());
    if (idx !== -1) {
      memoryBookings[idx] = { ...memoryBookings[idx], ...this };
    }
    return this;
  };
  
  return instance;
};

const BookingFallback = {
  find: (query = {}) => {
    if (!global.isMockDB) {
      return BookingModel.find(query);
    }
    console.log('⚡ [MockDB] Booking.find called with', query);
    
    let results = [...memoryBookings];
    
    if (query.studentEmail) {
      results = results.filter(b => b.studentEmail === query.studentEmail);
    }
    
    // Sort by bookingDate descending
    results.sort((a, b) => b.bookingDate - a.bookingDate);
    
    const chain = {
      sort: () => chain,
      then: (resolve) => {
        resolve(results.map(makeBookingInstance));
      }
    };
    
    const responseArray = results.map(makeBookingInstance);
    responseArray.sort = () => responseArray;
    
    return responseArray;
  },
  
  findOne: async (query = {}) => {
    if (!global.isMockDB) {
      return BookingModel.findOne(query);
    }
    console.log('⚡ [MockDB] Booking.findOne called with', query);
    
    const found = memoryBookings.find(b => {
      let match = true;
      if (query.tutorId && b.tutorId.toString() !== query.tutorId.toString()) {
        match = false;
      }
      if (query.studentEmail && b.studentEmail !== query.studentEmail) {
        match = false;
      }
      if (query.bookingStatus) {
        if (query.bookingStatus.$ne && b.bookingStatus === query.bookingStatus.$ne) {
          match = false;
        } else if (typeof query.bookingStatus === 'string' && b.bookingStatus !== query.bookingStatus) {
          match = false;
        }
      }
      return match;
    });
    
    return found ? makeBookingInstance(found) : null;
  },
  
  findById: async (id) => {
    if (!global.isMockDB) {
      return BookingModel.findById(id);
    }
    console.log('⚡ [MockDB] Booking.findById called with', id);
    const booking = memoryBookings.find(b => b._id.toString() === id.toString());
    return booking ? makeBookingInstance(booking) : null;
  },
  
  create: async (data) => {
    if (!global.isMockDB) {
      return BookingModel.create(data);
    }
    console.log('⚡ [MockDB] Booking.create called with', data);
    const newBooking = {
      ...data,
      _id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      bookingDate: new Date(),
      bookingStatus: 'confirmed'
    };
    memoryBookings.push(newBooking);
    return makeBookingInstance(newBooking);
  }
};

export default BookingFallback;
