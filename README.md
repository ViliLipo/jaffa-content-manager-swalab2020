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
- Application services will use separate Sqlite3-databases.
- Inter service communication will use RabbitMQ. The services will differentiate between different types
of messages by using different queues.
- Inter service communication will use RabbitMQ. Simple implementation of the Reactor-pattern will
be used to handle different types of events, in which the machine queue will be the event queue and

### The Saga-pattern

The Saga-pattern becomes necessary when each micro service has an own database. 
It is used to manage transactions in this context.
In the case of Jaffa, the transaction is posting content. In that operation
the content manager, needs to get validation from the moderation manager to proceed
with the transaction. Only the moderation manager knows if a user has permissions
to post to certain topic threads.

### Challenges

Challenges I have faced during the project have mostly revolved around making
the Saga-pattern apparent from the source code alone. At the moment there
is a clear code-model gap that is born from my compliance to the usual way
of organizing Express.js back-end. The inter service communication is just "tacked" on 
without much fines. Also there is a challenges with usability as how to inform a user
if their transaction fails.
