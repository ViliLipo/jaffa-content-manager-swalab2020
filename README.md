# Just a fast forum application --> Jaffa 🍊 SWALAB2020

## Project definition

### Short description
This is a project meant to demonstrate the Saga-micro-service pattern in a
discussion forum context.  In Just a fast forum application, Jaffa for short, I
try to combine the instantaneous nature of chat applications with more
structured format of traditional discussion forums. The main goal of the
application is to display new messages on a thread to all users as fast as
possible to keep up with heated debates and discussion.

The back-end will have the following services:

- Core
  - Content Management
  - User Management
  - Moderation Service
- Auxiliary
  - Authorization
  - Logging
  - Analytics

This decomposing strategy follows the "decompose by business capability"-pattern. 

### Concrete Features of Jaffa.

- CRUD-functionality on threads.
  - Threads will be used to structure discussions by topics.
- CRUD-functionality on comments.
  - The architecture must guarantee fast delivery of comments to all participators.
- User-management
  - Will be a separate micro-service
  - Roles
  - Contact Information
- Forum moderation
  - Will be a separate micro-service
  - Banning users from certain threads
  - Optional message rate limiting in busy threads

### Implementation details

- The back-end micro-services are implemented in Node.js/Express.js framework.
- The front-end will use React.js
- The application will use a single database server, but will use the private-tables-per-service pattern.
- Interservice communication will use RabbitMQ. Simple implementation of the Reactor-pattern will
be used to handle different types of events, in which the machine queue will be the event queue and
i will create a eventHandlerFactory to create a function that corresponds to a type of an event.

### The Saga-pattern

The Saga-pattern becomes necessary when each microservice has an own database. 
It is used to manage transactions in this context.
In the case of Jaffa, the transaction is posting content. In that operation
the content manager, needs to get validation from the moderation manager to proceed
with the transaction. Only the moderation manager knows if a user has permissions
to post to certain topic threads.
