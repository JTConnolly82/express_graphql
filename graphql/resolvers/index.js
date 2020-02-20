const authResolver = require('./auth');
const eventsResolver = require('./eventResolver');
const bookingResolver = require('./bookingResolver');


const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
};

module.exports = rootResolver;