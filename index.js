require("dotenv").config();
const { Image, Album } = require("./model/associations");

console.log(`\x1b[36m
    ___    ___ ____   ____                                  _          
   /   |  / (_) __/  / __ )____  _________ _____ ___  ___  (_)__  _____
  / /| | / / / /_   / __  / __ \\/ ___/ __ \`/ __ \`__ \\/ _ \\/ / _ \\/ ___/
 / ___ |/ / / __/  / /_/ / /_/ / /  / /_/ / / / / / /  __/ /  __/ /    
/_/  |_/_/_/_/    /_____/\\____/_/   \\__, /_/ /_/ /_/\\___/_/\\___/_/     
                                   /____/                              
Gallery
\x1b[0m`);

console.log("Node environment: \x1b[33m", process.env.NODE_ENV, "\x1b[0m");

async function setup() {
  // sync the database
  const db = require("./database/database");
  db.sync({ alter: true })
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((error) => {
      console.error("Error synchronizing the database:", error);
    });

  const [public_album, created] = await Album.findOrCreate({
    where: {
      title: "Public",
    },
    defaults: {
      description: "Public album",
      creationDate: new Date(),
    },
  });

  if (created) {
    console.log("Public album created");
  } else {
    console.log("Public album already exists");
  }

  const express = require("express");
  const app = express();
  const port = process.env.PORT || 3000;

  // setup middlewares
  app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
  const cookieParser = require("cookie-parser");
  app.use(
    cookieParser({
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // setup static public files
  app.use("/public", express.static(__dirname + "/public"));

  // setup static files for node_modules
  app.use(
    "/plugins/uikit",
    express.static(__dirname + "/node_modules/uikit/dist")
  );
  app.use(
    "/plugins/photoswipe",
    express.static(__dirname + "/node_modules/photoswipe/dist")
  );

  // setup static files for uploaded user images
  app.use("/userdata/uploads", express.static(__dirname + "/userdata/uploads"));

  // setup routes
  require("./routes/routes")(app);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

setup();