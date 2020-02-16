const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const bcrypt = require('bcryptjs');

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return { 
          ...event._doc, 
          _id: event.id, 
          creator: user.bind(this, event.creator),
          date: new Date(event._doc.date).toISOString() 
        }
      })
    })
    .catch(err => {
      console.dir(err)
      throw err
    })
}


const user = userId => {
  return User.findById(userId)
    .then(user => {
      return { 
        ...user._doc, 
        _id: user.id, 
        createdEvents: events.bind(this, user._doc.createdEvents)
      } 
    })
    .catch(err => {
      throw err
    })
}

module.exports = { 
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc, 
            _id: event.id,
            creator: user.bind(this, event._doc.creator),
            date: new Date(event._doc.date).toISOString() 
          }
        })
      })
      .catch(err => console.dir(err));
  },
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            _id: booking.id,
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          }
        })
      })
      .catch(err => {
        throw err
      })
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5e4873469f0df4abeb5cdb25'
    })
    let createdEvent = '';
    return event.save()
      .then(res => {
        createdEvent = { ...res._doc, _id: res._doc._id.toString(), creator: user.bind(this, res._doc.creator) };
        return User.findById('5e4873469f0df4abeb5cdb25');
      })
      .then(user => {
        if (!user) {
          throw new Error('user not found')
        }
        user.createdEvents.push(event)
        return user.save();
      })
      .then(res => {
        return createdEvent;
      })
      .catch(err => {
        console.dir(err);
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({email: args.userInput.email})
      .then(user => {
        if (user) {
          throw new Error('account already registered with this email')
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
    // takes pw, salts 12 (amnt 2nd arg) times
      .then(hashedPw => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPw
        })
        return user.save();
      })
      .then(res => {
        return {...res._doc, password: null, _id: res.id}
      })
      .catch(err => {
        console.dir(err);
        throw err;
      })
  },
  bookEvent: args => {
    return Event.findOne({_id: args.eventId})
    .then(targetEvent => {
      booking = new Booking({
        user: '5e486616ed6767abca835faa',
        event: targetEvent
      })
      return booking.save()
    })
      .then(createdBooking => {
        return { 
          ...createdBooking._doc, 
          _id: createdBooking.id,
          createdAt: new Date(createdBooking._doc.createdAt).toISOString(),
          updatedAt: new Date(createdBooking._doc.updatedAt).toISOString() 
        }
      })
      .catch(err => {
        throw err
      })
  },
  cancelBooking: args => {

  }
 }