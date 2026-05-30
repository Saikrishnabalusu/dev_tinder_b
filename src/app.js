const express = require("express")
const cookieParser = require("cookie-parser")
const { connectDB } = require("./config/database.js");
const authRouter = require("./routes/authRoute.js")
const profileRouter = require("./routes/profileRoute.js")
const { connectionRoute } = require("./routes/connectionRoute.js")
const { requestRoute } = require("./routes/requestRoute.js")
const { feedRouter } = require("./routes/feedroute.js")
const cors = require("cors")
const http = require("http");
const { initializeSocket } = require("./utils/socket.js");


require('dotenv').config()
const app = express();
const server = http.createServer(app)
app.use(express.json()) // to parse the incoming request body in json format and make it available in req.body
app.use(cookieParser()) // to parse the incoming request cookies and make it available in req.cookies
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent in cross-origin requests
};
app.use(cors(corsOptions)) // to allow cross-origin requests from the frontend to the backend

app.use("/", feedRouter)
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRoute);
app.use("/", requestRoute)
initializeSocket(server) // to initialize the socket connection for real-time communication between the server and the clients
connectDB().then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
        console.log(`app listening successfully on port ${process.env.PORT}...`);
    })

}).catch(e => console.error("database connection failed! with error: " + e.message));


app.use("/", (err, req, res, next) => { // To handle error in any route 
    if (err) {
        res.status(500).send("something Went wrong" + err);
    }
})



