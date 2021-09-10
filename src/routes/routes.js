// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This is the main route script
//

module.exports = function (app) {
  const didRoutes = require("./did.routes");

  //app.use("/auth", authRoutes);
  app.use("/did", didRoutes);

  app.get("/", function (req, res) {
    res.json({
      application: "Cryptonics DID API yahu!",
      version: "1.0",
    });
  });
};
