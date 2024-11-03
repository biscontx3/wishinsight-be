import app from "./server";

const port = process.env.PORT || 8080;

(async () => {
  const serverApp: any = await app();
  serverApp.listen(port, () => {
    console.log("API listening on port" + port);
  });
})();
