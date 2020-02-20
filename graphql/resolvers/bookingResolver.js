const Booking = require('../../models/booking')
const Event = require('../../models/event');
const { singleEvent, user } = require('./merge');


module.exports = {
  
  bookings: (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authenticated');
    }
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            _id: booking.id,
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event)
          }
        })
      })
      .catch(err => {
        throw err
      })
  },
  bookEvent: (args, req) => {
    if (!req.authMiddle) {
      throw new Error('not authenticated');
    }
    return Event.findOne({ _id: args.eventId })
    .then(targetEvent => {
      booking = new Booking({
        user: req.userId,
        event: targetEvent
      })
      return booking.save()
    })
      .then(createdBooking => {
        return { 
          ...createdBooking._doc, 
          _id: createdBooking.id,
          createdAt: new Date(createdBooking._doc.createdAt).toISOString(),
          updatedAt: new Date(createdBooking._doc.updatedAt).toISOString(),
          event: singleEvent.bind(this, createdBooking._doc.event)
        }
      })
      .catch(err => {
        throw err
      })
  },
  cancelBooking: (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authenticated');
    }
    return Booking.findOne({ _id: args.bookingId}).populate('event')
    .then(cancelledBooking => {
      return Booking.findByIdAndDelete(args.bookingId).then(()=> {
        return {
          ...cancelledBooking.event._doc,
          _id: cancelledBooking.event.id,
          creator: user.bind(this, cancelledBooking.event._doc.creator)
        };
      })
    })
    .catch(err => {
      throw err
    })
  }
}