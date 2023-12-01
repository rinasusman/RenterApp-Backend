import express from 'express'
import {
    LoginAdmin,
    logoutAdmin,
    clientListGet,
    blockUser,
    unBlockUser,
    AddCategory,
    categoryListGet,
    homeListGet,
    homeListGetverified,
    homeVerify,
    BookingListGet,
    HomesListGet,
    HomesUnListGet,
    earningsGet,
    pdfbookingGet,
    CategoryList,
    CategoryUnList,
    getbookingHome
} from '../controller/adminController.js'
import { adminToken } from '../middleware/auth.js'

const adminRouter = express.Router();

adminRouter.post("/adminlogin", LoginAdmin);
adminRouter.post('/adminlogout', logoutAdmin);
adminRouter.get("/getClientList", clientListGet);
adminRouter.put('/userblock/:id', blockUser);
adminRouter.put('/userunblock/:id', unBlockUser);

adminRouter.post('/addCategory', AddCategory)
adminRouter.get("/getCategoryList", categoryListGet);

adminRouter.get("/getHomeList", homeListGet);
adminRouter.get("/getHomeListverified", homeListGetverified);
adminRouter.put('/homeverify/:id', homeVerify);


adminRouter.get("/getBookingList", BookingListGet);

adminRouter.get("/homeList/:id", HomesListGet);
adminRouter.get("/homeUnList/:id", HomesUnListGet);

adminRouter.get("/earnings", earningsGet);
adminRouter.get("/pdfbooking", pdfbookingGet);

adminRouter.get("/CategoryList/:id", CategoryList);
adminRouter.get("/CategoryUnList/:id", CategoryUnList);

adminRouter.get('/dailybook', getbookingHome);

export default adminRouter; 