const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    
  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type Booking {
    _id: ID!
    event: Event!
    user: User!
    # createdAt & updatedAt reference timestamps 
    # made by mongodb booking model (timestamps = true)
    createdAt: String!
    updatedAt: String!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }
  
  type RootQuery {
      events: [Event!]!
      bookings: [Booking!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
      bookEvent(eventId: ID!): Booking!
      cancelBooking(bookingId: ID!): Event!
    }

    schema {
      query: RootQuery 
      mutation: RootMutation
    }
  `)
