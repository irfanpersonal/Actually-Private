require('dotenv').config();
require('express-async-errors');
const commentRouter = require('./routers/comment.js');
const postRouter = require('./routers/post.js');
const userRouter = require('./routers/user.js');
const authRouter = require('./routers/auth.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const notFoundMiddleware = require('./middleware/not-found.js');
const connectDB = require('./database/connect.js');
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('node:path');

app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

app.use(express.json());

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.static('./images'));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/posts', postRouter);

app.use('/api/v1/comments', commentRouter);

app.get('*', (req, res) => {
	return res.status(200).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const start = async() => {
    try {   
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
    catch(error) {
        console.log(error);
    }
}

start();