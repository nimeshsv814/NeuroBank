import app from "./src/app.js";
import { connectMQ } from "./src/broker/rabbit.js";
import config from "./src/configs/config.js";

const port = config.PORT;

connectMQ();

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
