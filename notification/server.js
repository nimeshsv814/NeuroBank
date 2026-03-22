import app from "./src/app.js";
import { connectMQ } from "./src/broker/rabbit.js";
import config from "./src/configs/config.js";
import { initNotificationConsumer } from "./src/broker/notificationConsumer.js";

const port = config.PORT;

const bootstrap = async () => {
  await connectMQ();
  await initNotificationConsumer();

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start notification service:", error);
  process.exit(1);
});
