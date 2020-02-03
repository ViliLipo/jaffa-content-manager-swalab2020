const amqp = require('amqplib');

const receive = async (queueName) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const ok = await channel.assertQueue(queueName, { durable: false });
  if (ok) {
    channel.consume(queueName, (message) => {
      console.log(` Received ${message.content.toString()}`);
    }, { noAck: true });
    console.log('Waiting for messages.');
  }
};

receive('hello');
