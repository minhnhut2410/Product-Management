const express = require("express");
const methodOverride = require("method-override");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const mongoose = require("mongoose"); // directly use mongoose
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // stop the app if DB connection fails
    }
}

// Set up views
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Admin prefix
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Method override
app.use(methodOverride("_method"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Flash messages
app.use(cookieParser("domaymoduoc"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Static files
app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);

// Start server only after DB connects
connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});
