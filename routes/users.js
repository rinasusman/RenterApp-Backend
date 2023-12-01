import express from 'express'

import {
    SendOtp,
    verifyOTP,
    LoginUser,
    logoutUser,
    addHome,
    HomeList,
    SingleHomeList,
    ForgotSendOtp,
    verifyforgotOTP,
    ResetPassword,
    SingleHomeListuser,
    DeleteHomeList,
    AddFavorites,
    RemoveFavorites,
    getFavoriteHome,
    SearchHomeList,
    bookHome,
    checkbookHome,
    getBookingHome,
    Feedbackpost,
    FeedbackByHome,
    getreservationHome,
    updatestatusreservation,
    updateedithome,
    getearningsHome,
    getbookingHome,
    getUser,
    cancelBooking,
    getWallet
} from '../controller/userController.js';
import { createChat, getuserChat, findChat } from "../controller/chatController.js"
import { Authentication } from '../middleware/auth.js';
import { addMessage, getMessages } from '../controller/MessageController.js';

const userRoute = express.Router();

userRoute.post("/sendotp", SendOtp);
userRoute.post('/verifyotp', verifyOTP);
userRoute.post("/login", LoginUser);
userRoute.post('/logout', logoutUser);
userRoute.post("/forgotsendotp", ForgotSendOtp);
userRoute.post('/verifyotpfogot', verifyforgotOTP);
userRoute.post('/passwordReset', ResetPassword);



userRoute.post('/addhome', Authentication, addHome);
userRoute.get('/getHomeList', HomeList);
userRoute.get('/getListingById/:id', SingleHomeList);
userRoute.get('/getHomeListSingle', Authentication, SingleHomeListuser);
userRoute.delete('/listdelete/:id', Authentication, DeleteHomeList);
userRoute.get('/getSearchHomeList', SearchHomeList);
userRoute.put('/edithomes/:id', updateedithome);



userRoute.post('/addfavorites', Authentication, AddFavorites);
userRoute.delete('/removefavorites', Authentication, RemoveFavorites);
userRoute.get('/getFavoriteHomeList', Authentication, getFavoriteHome);


userRoute.post('/bookhome', Authentication, bookHome);
userRoute.post('/checkBooking', Authentication, checkbookHome);
userRoute.get('/getbookhome', Authentication, getBookingHome);
userRoute.post('/feedback', Authentication, Feedbackpost);
userRoute.get('/getFeedbackByHome/:id', FeedbackByHome);

userRoute.get('/reservationhome', Authentication, getreservationHome);
userRoute.put('/statusbookings/:id', updatestatusreservation);

userRoute.get('/earnings', Authentication, getearningsHome);
userRoute.get('/dailybook', Authentication, getbookingHome);



userRoute.post('/createChat', createChat);
userRoute.get('/getchat/:userId', getuserChat);
userRoute.get('/find/:firstId/:secondId', findChat);

userRoute.post('/addMessage', addMessage);

userRoute.get('/getmessage/:chatId', getMessages);


userRoute.get('/user/:id', getUser);

userRoute.put('/cancelbooking/:bookingId', Authentication, cancelBooking)
userRoute.get('/ walletget', Authentication, getWallet);


export default userRoute;