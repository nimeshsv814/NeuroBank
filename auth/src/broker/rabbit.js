import amqplib from "amqplib";
import config from "../configs/config.js";

let connection, channel;

export const connectMQ = async () => {
  connection = await amqplib.connect(config.RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("RabbitMQ is Connected");
};

export const publishToQueue = async (queueName, data) => {
  if (!channel) {
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });

  console.log("Message sent to queue ", queueName);
};

export const subscribeToQueue = async (queueName, callback) => {
  if (!channel) {
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(queueName, (msg) => {
    if (msg !== null) {
      callback(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
};
