import amqplib from "amqplib";
import config from "../configs/config.js";

const RECONNECT_DELAY_MS = 5000;

let connection;
let channel;
let connectPromise;
let reconnectTimer;
const subscriptions = [];

const onConnectionError = (error) => {
  console.error("RabbitMQ connection error:", error.message);
};

const onConnectionClose = () => {
  console.warn(
    `RabbitMQ connection closed. Retrying in ${RECONNECT_DELAY_MS / 1000}s...`,
  );
  resetMQState();
  scheduleReconnect();
};

const onChannelError = (error) => {
  console.error("RabbitMQ channel error:", error.message);
};

const onChannelClose = () => {
  console.warn(
    `RabbitMQ channel closed. Retrying in ${RECONNECT_DELAY_MS / 1000}s...`,
  );
  resetMQState();
  scheduleReconnect();
};

const removeListeners = () => {
  if (channel) {
    channel.removeListener("error", onChannelError);
    channel.removeListener("close", onChannelClose);
  }

  if (connection) {
    connection.removeListener("error", onConnectionError);
    connection.removeListener("close", onConnectionClose);
  }
};

const resetMQState = () => {
  removeListeners();
  channel = undefined;
  connection = undefined;
};

const scheduleReconnect = () => {
  if (reconnectTimer) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    void connectMQ();
  }, RECONNECT_DELAY_MS);
};

const attachConsumer = async ({ queueName, callback }) => {
  if (!channel) {
    return;
  }

  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(queueName, async (msg) => {
    if (msg === null) {
      return;
    }

    try {
      await callback(JSON.parse(msg.content.toString()));
      channel?.ack(msg);
    } catch (error) {
      console.error(`Error processing message from ${queueName}:`, error);
      channel?.nack(msg, false, true);
    }
  });
};

export const connectMQ = async () => {
  if (channel) {
    return channel;
  }

  if (connectPromise) {
    return connectPromise;
  }

  if (!config.RABBITMQ_URL) {
    console.error("RabbitMQ URL is missing. Skipping MQ connection.");
    return null;
  }

  connectPromise = (async () => {
    let nextConnection;
    let nextChannel;

    try {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = undefined;
      }

      nextConnection = await amqplib.connect(config.RABBITMQ_URL);
      nextChannel = await nextConnection.createChannel();

      nextConnection.on("error", onConnectionError);
      nextConnection.on("close", onConnectionClose);
      nextChannel.on("error", onChannelError);
      nextChannel.on("close", onChannelClose);

      connection = nextConnection;
      channel = nextChannel;

      for (const subscription of subscriptions) {
        await attachConsumer(subscription);
      }

      console.log("RabbitMQ is connected");
      return channel;
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error.message);

      if (nextChannel) {
        try {
          await nextChannel.close();
        } catch {}
      }

      if (nextConnection) {
        try {
          await nextConnection.close();
        } catch {}
      }

      resetMQState();
      scheduleReconnect();
      return null;
    } finally {
      connectPromise = undefined;
    }
  })();

  return connectPromise;
};

export const publishToQueue = async (queueName, data) => {
  if (!channel) {
    await connectMQ();
  }

  if (!channel) {
    console.warn(`RabbitMQ unavailable. Skipping publish to ${queueName}.`);
    return false;
  }

  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });

    console.log("Message sent to queue ", queueName);
    return true;
  } catch (error) {
    console.error(`Failed to publish message to ${queueName}:`, error.message);
    resetMQState();
    scheduleReconnect();
    return false;
  }
};

export const subscribeToQueue = async (queueName, callback) => {
  const exists = subscriptions.some(
    (subscription) =>
      subscription.queueName === queueName &&
      subscription.callback === callback,
  );

  if (!exists) {
    subscriptions.push({ queueName, callback });
  }

  if (!channel) {
    await connectMQ();
    if (!channel) {
      console.warn(
        `RabbitMQ unavailable. Consumer for ${queueName} will start after reconnect.`,
      );
      return;
    }
  }

  await attachConsumer({ queueName, callback });
};
