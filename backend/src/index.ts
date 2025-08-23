import express from "express";

const application = express();

application.get("/", (request, response) => {
  response.status(200).json({
    message: "ExpressJS Server is running",
  });
});

application.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
