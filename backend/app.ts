import { User, Book, Borrow } from "./model";
import BookRouter from "./routes/book";
import CategoryRouter from "./routes/category";
import UserRouter from "./routes/user";
import BorrowRouter from "./routes/borrow";
import LoginRouter from "./routes/login";
import LogoutRouter from "./routes/logout";
import { expressjwt } from "express-jwt";
import express, { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from "./constant";
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
require('./model/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressjwt({secret: SECRET_KEY, algorithms:['HS256']}).unless({path: ['/api/login']}));

app.use('/api/books', BookRouter);
app.use('/api/categories', CategoryRouter);
app.use('/api/borrows', BorrowRouter);
app.use('/api/users', UserRouter);
app.use('/api/login', LoginRouter);
app.use('/api/logout', LogoutRouter);

// app.get('/api/borrows', (req:Request, res:Response) => {
//   const borrow = new Borrow({
//     book:'662d798c78a53f98eba6aa94',
//     user: '662d5ba6a0c2d01bff5d7a05'
//   });
//   borrow.save().then(() => {
//     console.log(res);
//     res.send(res);
//   });
// });

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

app.listen(3005, () => {
  console.log("Server is running on port 3005");
});

module.exports = app;
