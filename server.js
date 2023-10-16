const http = require("http");
const fs = require("fs");
const path = require("path");
const events = require("events");

const eventEmitter = new events.EventEmitter();
const logsDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const server = http.createServer((req, res) => {
  const url = req.url; // Declare the url variable here

  function handleRoute(routePath, contentType, statusCode = 200) {
    const filePath = path.join(__dirname, "public", routePath);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        sendResponse(res, "Internal Server Error", 500, "text/html");
      } else {
        sendResponse(res, data, statusCode, contentType);
      }
    });
  }

  function sendResponse(
    res,
    content,
    statusCode = 200,
    contentType = "text/plain"
  ) {
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.end(content);
  }

  switch (url) {
    case "/":
      handleRoute("index.html", "text/html");
      break;
    case "/about":
      handleRoute("about.html", "text/html");
      break;
    case "/contact":
      handleRoute("contact.html", "text/html");
      break;
    case "/products":
      handleRoute("products.html", "text/html");
      break;
    case "/subscribe":
      handleRoute("subscribe.html", "text/html");
      break;
    case "/services":
      handleRoute("services.html", "text/html");
      break;
    case "/blog":
      handleRoute("blog.html", "text/html");
      break;
    default:
      sendResponse(res, "Not Found", 404, "text/html");
  }

  eventEmitter.emit("log", `Requested ${url}`);
  console.log(`Requested ${url}`);
});

process.on("SIGINT", function () {
  console.log("\nGettin da Jesus out of it. (Ctrl-C)");
  server.close(() => {
    console.log("Da arse is gone right out of er luh!!.");
    process.exit(0);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

eventEmitter.on("log", (message) => {
  console.log(message);

  const currentDate = new Date();
  const logFileName = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}.log`;
  const logFilePath = path.join(logsDirectory, logFileName);

  fs.appendFile(logFilePath, `${message}\n`, (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err.message}`);
    } else {
      console.log(`Log has been written to ${logFilePath}`);
    }
  });
});
