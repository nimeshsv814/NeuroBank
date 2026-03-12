import app from "./src/app.js";
import config from "./src/configs/config.js";

const port = config.PORT;

console.log(process.env.PORT);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
