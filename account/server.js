import app from "./src/app.js";
import { connectMQ } from "./src/broker/rabbit.js";
import { startTransitionConsumer } from "./src/broker/transitionConsumer.js";
import config from "./src/configs/config.js";
import connectDB from "./src/db/db.js";

const port = config.PORT;

const bootstrap = async () => {
  connectDB();
  await connectMQ();
  await startTransitionConsumer();

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start account service:", error);
  process.exit(1);
});
