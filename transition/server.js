import app from "./src/app.js";
import config from "./src/configs/config.js";
import connectDB from "./src/db/db.js";
import { connectMQ } from "./src/broker/rabbit.js";
import { startAccountConsumer } from "./src/broker/accountConsumer.js";

const port = config.PORT;

const bootstrap = async () => {
  connectDB();
  await connectMQ();
  await startAccountConsumer();

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start transition service:", error);
  process.exit(1);
});
