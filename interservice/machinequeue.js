const amqp = require('amqplib');


const generateUuid = () => Math.random().toString()
+ Math.random().toString()
+ Math.random().toString()
+ Math.random().toString();

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

const registerReceiver = async (queueName, receiver) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const ok = await channel.assertQueue(queueName, { durable: false });
  if (ok) {
    channel.consume(queueName, (message) => {
      console.log(` Received ${message.content.toString()}`);
      receiver(message);
    }, { noAck: true });
    console.log('Waiting for messages.');
  }
};

const mqRPC = async (message, sendQueue, receiver) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const correlationId = generateUuid();
  const receivingQueue = await channel.assertQueue('', { exclusive: true });
  if (receivingQueue) {
    const returnPromise = new Promise((resolve, reject) => {
      channel.consume(receivingQueue.q, async (reply) => {
        if (reply.properties.correlationId === correlationId) {
          const value = await receiver(reply, returnPromise);
          resolve(value);
        }
      }, { noAck: true });
      channel.sendToQueue(sendQueue, Buffer.from(message),
        { correlationId, replyTo: receivingQueue.queue });
      console.log(`Sent ${message} to queue ${sendQueue}.`);
    });
    return returnPromise;
  }
  return false;
};

module.exports = { mqSend, registerReceiver, mqRPC };
