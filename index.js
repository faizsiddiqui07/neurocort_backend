const express = require('express')
const dotenv = require('dotenv')
const db_connect = require('./utils/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')

dotenv.config()

const app = express()
const port = process.env.port || 8000;

app.use(express.json());
app.use(cookieParser())
app.use("/files", express.static("files"));


app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://neurocort-frontend.s3-website.ap-south-1.amazonaws.com',
            'http://localhost:5173', 
        ];

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));



app.use(session({
    secret: "erjgqrg5ergwgwt2hw5twjgh534BjugKJ", //random key
    resave: false,
    saveUninitialized: true,
}))


app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/serviceRoutes'))
app.use('/', require('./routes/userRoutes'))
app.use('/', require('./routes/blogRoutes'))

db_connect()


app.listen(port, () => console.log(`Server running on port ${port}!`))