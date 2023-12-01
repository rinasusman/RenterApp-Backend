import moment from 'moment'
import User from '../models/userSchema.js'
import Category from '../models/categoryModel.js';
import Booking from '../models/bookingModel.js';
import { adminToken } from '../middleware/auth.js';
import Home from '../models/homeModel.js';

let credentials = {
    email: "admin@gmail.com",
    password: "123",
}
export const LoginAdmin = async (req, res, next) => {
    let adminResult = {
        Status: false,
        message: null,
        token: null,
    };

    try {
        let adminDetails = req.body;
        // const { email, password } = req.body

        if (credentials.email === adminDetails.email) {
            if (credentials.password === adminDetails.password) {
                let admin = {
                    email: adminDetails.email,
                    password: adminDetails.password,
                }
                const token = adminToken(admin);
                adminResult.Status = true;
                adminResult.token = token;
                adminResult.message = "You are logged";
                // res.json({ adminResult });
                res.status(201).json({
                    adminResult
                })


            } else {
                adminResult.message = "Your Password not matched";
                // // res.json({ adminResult });
                // // 
                res.status(401).json({ adminResult })
            }
        } else {
            // adminResult.message = "Your email is wrong";
            // res.json({ adminResult });
            res.status(401).json({ message: "Your email is wrong" })
        }


    } catch (error) {
        console.log(error);
    }

};
export const logoutAdmin = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


export const clientListGet = async (req, res) => {
    try {
        const clientData = await User.find()
        res.json(clientData);
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req, res) => {
    const id = req.params.id;
    const action = req.query.action;
    console.log(action, "acttttttttttt")
    try {
        const updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { status: action === 'Block' ? false : true } },
            { new: true }
        );

        if (action === 'Block') {
            req.session.user = false;
        }

        res.json(updatedUser);
        console.log(updatedUser, "stststs")
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error updating user status');
    }
};


export const blockUser = async (req, res) => {
    console.log("hello block user")

    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        if (!user) {
            res.status(401).json({ message: "user does not exist" })
        }
        user.status = true
        const b = await user.save()
        res.json({ message: "user blocked successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}


export const unBlockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        if (!user) {
            res.json({ message: "user not found" })
        }
        user.status = false
        const c = await user.save()
        res.json({ message: "user unblocked successfully" })

    } catch (error) {
        console.log(error.message)
    }
}




export const categoryListGet = async (req, res) => {
    try {
        const categoryData = await Category.find()
        res.json(categoryData);
    } catch (error) {
        console.log(error);
    }
}

export const homeListGet = async (req, res) => {
    try {
        const homeData = await Home.find({ status: "false" })
        res.json(homeData);
    } catch (error) {
        console.log(error);
    }
}
export const homeListGetverified = async (req, res) => {
    try {
        const homeDatas = await Home.find({ status: "true" })
        res.json(homeDatas);
    } catch (error) {
        console.log(error);
    }
}

export const AddCategory = async (req, res) => {

    const categoryName = req.body.name;
    const description = req.body.description;
    const lowerCategoryName = categoryName.toLowerCase();
    try {
        const categoryExist = await Category.findOne({ name: lowerCategoryName });
        if (!categoryExist) {
            Category.create({
                name: lowerCategoryName,
                description: description
            });
            res.json({
                success: true,
                message: "Category created Successfully"
            });
        } else {
            res.status(401).json({ message: "Category already exists" }); // Fixed the typo here
        }
    } catch (error) {
        console.log(error.message);
    }
}




export const homeVerify = async (req, res) => {
    console.log("hello block user")

    try {
        const home = await Home.findByIdAndUpdate(req.params.id)
        if (!home) {
            res.status(401).json({ message: "home does not exist" })
        }
        home.status = true
        const b = await home.save()
        res.json({ message: "Home verified  successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}

export const earningsGet = async (req, res) => {
    try {
        const homeData = await Home.find({ status: "true" })
        const totalHome = homeData.length
        console.log(totalHome, "totalHome:")
        const clientData = await User.find()
        const totalUser = clientData.length
        console.log(totalUser, "totalUser:")
        const BookingData = await Booking.find()
        const totalBooking = BookingData.length
        console.log(totalBooking, "totalBooking::::::")

        res.status(200).json({ totalHome, totalUser, totalBooking });
    } catch (error) {
        console.error('Error fetching home details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const pdfbookingGet = async (req, res) => {
    console.log("enter pdf")
    const { startDateString, endDateString } = req.query;
    console.log(startDateString, "startdate:")
    try {


        const bookings = await Booking.find({
            bookingDate: { $gte: startDateString, $lte: endDateString },
        }).populate({
            path: 'item.home',
            select: 'location title imageSrc',
        }).populate({
            path: 'userId',
            select: 'name',
        });;

        console.log(bookings, "pdf:::::::")
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const BookingListGet = async (req, res) => {
    try {
        const BookingData = await Booking.find().populate({
            path: 'item.home',
            select: 'location title imageSrc',
        }).populate({
            path: 'userId',
            select: 'name',
        })
        res.json(BookingData);

        console.log(BookingData, "BookingData:")

    } catch (error) {
        console.log(error);
    }
}




export const HomesListGet = async (req, res) => {
    const id = req.params.id;
    console.log(id, "id:")

    try {
        const user = await Home.findByIdAndUpdate(id)
        if (!user) {
            res.status(401).json({ message: "user does not exist" })
        }
        user.isDeleted = false
        await user.save();
        res.json({ message: "user List successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}
export const CategoryList = async (req, res) => {
    const id = req.params.id;
    console.log(id, "id:")

    try {
        const user = await Category.findByIdAndUpdate(id)
        if (!user) {
            res.status(401).json({ message: "user does not exist" })
        }
        user.isDeleted = false
        await user.save();
        res.json({ message: "user List successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}

export const HomesUnListGet = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await Home.findByIdAndUpdate(id)
        if (!user) {
            res.status(401).json({ message: "user does not exist" })
        }
        user.isDeleted = true
        await user.save();
        res.json({ message: "user UnList successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}


export const CategoryUnList = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await Category.findByIdAndUpdate(id)
        if (!user) {
            res.status(401).json({ message: "user does not exist" })
        }
        user.isDeleted = true
        await user.save();
        res.json({ message: "user UnList successfully" })
    }
    catch (error) {
        console.log(error.message)
    }
}



export const getbookingHome = async (req, res) => {
  
  console.log("enter admin:")
  try {
    const userHomes = await Home.find({
      status: true
    });
    const homeIds = userHomes.map(home => home._id);

    const bookings = await Booking.find({ 'item.home': { $in: homeIds } }).populate({
      path: 'item.home',
      select: 'location title imageSrc',
    })
    const dailyBookings = await Booking.aggregate([
      {
        $match: {
          'item.home': { $in: homeIds },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
            status: "$status",
          },
          count: { $sum: 1 }, totalPrice: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          totalBookings: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id.status", "Booked"] },
                then: "$count",
                else: 0,
              },
            },
          },
          totalCheckins: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id.status", "Checkin"] },
                then: "$count",
                else: 0,
              },
            },
          },
          totalCheckout: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id.status", "Checkout"] },
                then: "$count",
                else: 0,
              },
            },
          },
          totalCancelled: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id.status", "Cancelled"] },
                then: "$count",
                else: 0,
              },
            },
          },
          totalEarnings: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);


    console.log(dailyBookings, "dailyBookings");

    res.status(200).json({ dailyBookings });
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  }