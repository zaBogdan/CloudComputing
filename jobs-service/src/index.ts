import mongoose, { ConnectOptions } from "mongoose";
import app from "./app";

(async () => {
  await app.ready();
  await mongoose.connect(app.config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  app.log.info("Connected to MongoDB");
  const port = parseInt(app.config.PORT || "1338", 10);
  app.listen({ port }, (err) => {
    const currentDate = (date: number) =>
      new Date(date).toISOString().replace(/T/, " ").replace(/\..+/, "");
    if (err) {
      app.log.error(
        `${currentDate(
          Date.now()
        )}][jobs-service] Failed to start jobs-service. Exiting...`
      );
      app.log.error(err);
      process.exit(1);
    }
  });
})();
