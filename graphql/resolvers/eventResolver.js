const Event = require('../../models/event');
const User = require('../../models/user');
const { user } = require('./merge');


module.exports = { 
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          console.log(event._id)
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
  
  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error('not authenticated');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    })
    let createdEvent = '';
    return event.save()
      .then(res => {
        createdEvent = { ...res._doc, _id: res._doc._id.toString(), creator: user.bind(this, res._doc.creator) };
        return User.findById(req.userId);
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
  }
}