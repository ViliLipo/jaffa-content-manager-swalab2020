const amqp = require('amqplib');

const mqSend = async (message, queue) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const ok = await channel.assertQueue(queue, { durable: false });
  if (ok) {
    await channel.sendToQueue(queue, Buffer.from(message));
    console.log(`sent ${message} to queue ${queue}`);
  }
  await channel.close();
  await connection.close();
};

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

module.exports = { mqSend, receive };
