import bcrypt from 'bcrypt'
import User from '../models/userSchema.js'
import nodemailer from 'nodemailer';
import { generateAuthToken } from '../middleware/auth.js';
import Home from '../models/homeModel.js';
import Favorites from '../models/favoritesModel.js';
import Booking from '../models/bookingModel.js';
import Feedback from '../models/feedbackModel.js';





let saveOtp;
let name;
let email;
let password;
let otpcreated;

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp
}

export const SendOtp = async (req, res) => {
  console.log("Received a request to /sendotp");
  try {

    const emailExist = await User.findOne({ email: req.body.email ? req.body.email : email });
    if (!emailExist) {
      if (!saveOtp) {
        let generatedOtp = generateOTP();
        saveOtp = generatedOtp;
        otpcreated = Date.now()
        name = req.body.name ? req.body.name : name;
        email = req.body.email ? req.body.email : email;
        password = req.body.password ? req.body.password : password;
        setTimeout(() => {
          saveOtp = null;
        }, 120 * 1000);
        const result = await sendOtpMail(email, saveOtp);
        res.json(result)

      }
    } else {
      res
        .status(400)
        .json({ error: "Userdata already exists" })

    }
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({ success: false, message: "Something error happened" })
  }
};


export const ForgotSendOtp = async (req, res) => {
  console.log("Received a request to /sendotp");
  try {

    const emailExist = await User.findOne({ email: req.body.email ? req.body.email : email });
    if (emailExist) {
      if (!saveOtp) {
        let generatedOtp = generateOTP();
        saveOtp = generatedOtp;
        otpcreated = Date.now()
        email = req.body.email ? req.body.email : email;
        setTimeout(() => {
          saveOtp = null;
        }, 120 * 1000);
        const result = await sendOtpMail(email, saveOtp);
        res.json(result)

      }
    } else {
      res
        .status(400)
        .json({ error: "Userdata does not exists" })

    }
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({ success: false, message: "Something error happened" })
  }
};




async function sendOtpMail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shoeme442@gmail.com',
        pass: 'tnrhkkmrxhkxzifo'
      }
    });
    const mailOptions = {
      from: 'shoeme442@gmail.com',
      to: email,
      subject: 'Your OTP for user verification',
      text: `Your OTP is ${otp}. Please enter this code to verify your account.`
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.log('Error sending email:', error);
  }
}

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}



export const verifyOTP = async (req, res) => {

  const otp = req.body.otp;

  if (otp === saveOtp) {
    const securedPassword = await securePassword(password);
    User.create({
      name: name,
      email: email,
      password: securedPassword,

    });

    res.json({ success: true, message: "Account Created Successfully" });
  } else {
    res.status(400).json({ success: false, message: "Incorrect OTP" })
  }

}



export const verifyforgotOTP = async (req, res) => {

  const otp = req.body.otp;

  if (otp === saveOtp) {

    res.json({ success: true, message: " Success" });
  } else {
    res.status(400).json({ success: false, message: "Incorrect OTP" })
  }

}







export const LoginUser = async (req, res, next) => {
  let userSignUp = {
    Status: false,
    message: null,
    token: null,
    name: null,

  };

  console.log(req.body,'test---')
  try {
    const { email, password } = req.body.data;
console.log(req.body.data,"sdffffffffffffffffffffffff")
    const userExist = await User.findOne({ email });
    console.log(userExist.status, "stattussssssss")
    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (isMatch === true && userExist.status) {
        const token = generateAuthToken(userExist);
        const name = userExist.name;
        userSignUp.Status = true;
        userSignUp.message = "You are logged";
        userSignUp.token = token;
        userSignUp.name = userExist.name;
        console.log(token, "toooooooooooooooooooo")
        const obj = {
          token,
          name,
        };

        res.cookie("jwt", obj, {
          httpOnly: false,
        })
          .status(200)
          .send({ userSignUp: userSignUp, userdata: userExist });

      } else {
        userSignUp.Status = false;
        userSignUp.message = "Please enter correct Password or Email";
        res.send({ userSignUp });
      }
    } else {
      userSignUp.Status = false;
      userSignUp.message = "User not registered";
      res.send({ userSignUp });
    }

  } catch (error) {
    console.log("gfgfgfgfgfgfgfgf00",error)
    res.json({ status: "failed", message: "User not registered" });
  }

};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = async (req, res) => {

  const id = req.params.id;
  console.log(id, "id")
  try {
    const user = await User.findOne({ _id: id })

    if (user) {


      res.status(200).json(user);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {

  }

}

export const addHome = async (req, res) => {
  try {
    const { user } = req;
    const {
      category,
      location,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      title,
      description,
      price,
    } = req.body;

    // Check if a home with the same title already exists
    const existingHome = await Home.findOne({ title: title });

    if (existingHome) {
      return res.status(400).json({ message: 'A home with the same title already exists' });
    }

    // If no existing home with the same title, create and save the new home
    const newHome = new Home({
      userId: user._id,
      category,
      location,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      title,
      description,
      price,
      status: false,
    });

    await newHome.save();

    // Send a success response
    res.status(201).json({ message: 'Home added successfully' });
  } catch (error) {
    // Handle other errors and send an error response
    console.error(error);
    res.status(500).json({ message: 'Failed to add a home' });
  }
};


export const HomeList = async (req, res) => {
  try {
    const category = req.query.category;


    let homeDatas

    if (category) {
      homeDatas = await Home.find({ status: "true", category })
    } else {
      homeDatas = await Home.find({ status: "true" })
    }



    res.json(homeDatas)
  } catch (error) {
    console.log(error);
  }
}


export const SearchHomeList = async (req, res) => {
  try {

    const { location, startDate, endDate, guestCount, roomCount, bathroomCount } = req.query;

    let homeDatas
    if (location || startDate || endDate || guestCount || roomCount || roomCount) {
      const regex = new RegExp(location, 'i')
      homeDatas = await Home.find({ status: "true", location: { $regex: regex }, guestCount: { $gte: guestCount }, roomCount: { $gte: roomCount }, bathroomCount: { $gte: bathroomCount } })
    }
    else {
      homeDatas = await Home.find({ status: "true" })
    }




    res.json(homeDatas)
  } catch (error) {
    console.log(error);
  }
}

export const SingleHomeList = async (req, res) => {

  const itemId = req.params.id;
  console.log(itemId, "itemidddddddddddd")
  try {
    const listing = await Home.findById(itemId).populate('userId');
    console.log(listing, "dattttttttttttttta")
    const booking = await Booking.find({ 'item.home': itemId })
    console.log(booking, "bookingDetails::")
    const filteredBookings=booking.filter(booking=>booking.status!=='Cancelled')
    if (listing) {
      const bookingDetails = filteredBookings.map(booking => ({
        startDate: booking.startDate,
        endDate: booking.endDate,
      }));

      console.log("Booking Details:", bookingDetails);
      res.status(200).json({ listing, bookingDetails });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}




export const SingleHomeListuser = async (req, res) => {

  const { user } = req;
  console.log(user, "uuuuuuuuuuuuuuuuuuuuu")
  try {
    const listings = await Home.find({
      userId: user._id,
      status: true
    });
    console.log(listings, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
    if (listings) {
      res.status(200).json(listings);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



export const DeleteHomeList = async (req, res) => {

  try {
    const listing = await Home.findById(req.params.id);
    console.log(listing, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await Home.deleteOne({ _id: req.params.id })

    res.json({ message: 'Listing deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}



export const ResetPassword = async (req, res) => {

  const password = req.body.password;


  console.log(password, "secureeeeeeeeeeeee")
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    const securedPassword = await securePassword(password);
    User.updateOne({
      email: email
    }, { $set: { password: securedPassword } })


    res.json({ success: true, message: "Password update Successfully" });
  } else {
    res.status(400).json({ success: false, message: "Something wrong" })
  }

}

export const AddFavorites = async (req, res) => {

  const { user } = req;
  const { listingId } = req.body
  console.log(user, "pppppppppppppppppppppp")
  console.log(listingId, "listingidddddddddddddddddddd")
  try {
    const existingFavorite = await Favorites.findOne({ userId: user._id, });
    if (existingFavorite) {
      // Update the existing user's favorites list
      existingFavorite.item.push({ home: listingId });
      await existingFavorite.save();
      res.json({ message: 'Added to favorites' });
    } else {
      // Create a new favorites document for the user
      const newFavorite = new Favorites({
        userId: user._id,
        item: [{ home: listingId }],
      });
      await newFavorite.save();
      res.json({ message: 'Added to favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


export const RemoveFavorites = async (req, res) => {
  const { listingId } = req.body;
  const { user } = req

  if (!listingId) {
    return res.status(400).json({ error: 'Listing ID is required' });
  }

  try {

    const userFavorites = await Favorites.findOne({ userId: user._id });
    console.log(user._id, "UserId:.............")
    if (!userFavorites) {
      return res.status(404).json({ error: 'User not found in favorites' });
    }


    const index = userFavorites.item.findIndex((item) => item.home.toString() === listingId);

    if (index !== -1) {

      userFavorites.item.splice(index, 1);
      await userFavorites.save();

      return res.status(200).json({ message: 'Listing removed from favorites' });
    } else {
      return res.status(404).json({ error: 'Listing not found in favorites' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}




export const getFavoriteHome = async (req, res) => {
  const { user } = req;
  console.log(user, "user:......");

  try {
    const listings = await Favorites.find({
      userId: user._id,
    }).populate('item.home');
    console.log(listings, "fav:..........");

    if (listings.length > 0) {
      const detailsData = listings.map((favorite) => favorite.item);
      console.log("detadata:", detailsData);
      const fav = detailsData[0].map((item) => item.home)
      console.log("data:", fav);
      res.status(200).json(fav);
    } else {
      res.status(404).json({ message: 'No favorite listings found' });
    }
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



export const bookHome = async (req, res) => {
  try {
    console.log('Request received');
    const { user } = req;
    const {
      startDate,
      endDate,
      totalPrice,
      paymentType,
      homeid
    } = req.body;
    console.log(req.body, "body:");
    const existingBooking = await Booking.findOne({
      'item.home': homeid,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'A home with the same date already booked' });
    }

    // If no existing home with the same title, create and save the new home
    const newBooking = new Booking({
      userId: user._id,
      item: [{ home: homeid }],
      totalPrice: totalPrice,
      startDate: startDate,
      endDate: endDate,
      bookingDate: Date.now(),
      paymentType: paymentType,
      status: "Booked"
    });
    console.log('Before saving the new booking');
    await newBooking.save();
    console.log('After saving the new booking')
    console.log(newBooking, "booking::::")
    // Send a success response
    res.status(201).json({ message: 'Home booked successfully' });
  } catch (error) {
    // Handle other errors and send an error response
    console.error(error);
    res.status(500).json({ message: 'Failed to book a home' });
  }
};


export const checkbookHome = async (req, res) => {
  const { startDate, endDate, homeid } = req.body;

  const existingBooking = await Booking.findOne({
    'item.home': homeid,
    startDate: { $lte: endDate },
    endDate: { $gte: startDate }

  });
  if (existingBooking) {
    res.json({ isBooked: true });
  } else {
    res.json({ isBooked: false });
  }
}




export const getBookingHome = async (req, res) => {
  const { user } = req;
  console.log(user, "user:......");

  try {
    const listings = await Booking.find({
      userId: user._id,
    }).populate({
      path: 'item.home',
      select: 'location title imageSrc',
    });
    console.log(listings, "Book:..........");

    if (listings.length > 0) {
      const detailsData = listings.map((booking) => ({
        home: {
          id: booking.item?.[0]?.home?._id ?? 'N/A',
          location: booking.item?.[0]?.home?.location ?? 'N/A',
          title: booking.item?.[0]?.home?.title ?? 'N/A',
          imageSrc: booking.item?.[0]?.home?.imageSrc ?? 'N/A',
        },
        startDate: booking.startDate ?? 'N/A',
        endDate: booking.endDate ?? 'N/A',
        status: booking.status ?? 'N/A',
        _id: booking._id ?? 'N/A'
      }));
      console.log("detadata:", detailsData);

      res.status(200).json(detailsData);
    } else {
      res.status(404).json({ message: 'No Booking listings found' });
    }
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getreservationHome = async (req, res) => {
  const { user } = req;


  try {
    const userHomes = await Home.find({
      userId: user._id,
      status: true
    });
    console.log(userHomes, "userhomes::::")
    const homeIds = userHomes.map(home => home._id);
    console.log(homeIds, "home::::")
    const bookings = await Booking.find({ 'item.home': { $in: homeIds } }).populate({
      path: 'item.home',
      select: 'location title imageSrc',
    }).populate({
      path: 'userId',
      select: 'name',
    });;
    console.log(bookings, "bookkkkkk:")
    bookings.forEach(booking => {
      console.log("Start Date:", booking.startDate);
      console.log("End Date:", booking.endDate);
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}





export const getearningsHome = async (req, res) => {
  const { user } = req;


  try {
    const userHomes = await Home.find({
      userId: user._id,
      status: true
    });
    const homeIds = userHomes.map(home => home._id);

    const bookings = await Booking.find({ 'item.home': { $in: homeIds } }).populate({
      path: 'item.home',
      select: 'location title imageSrc',
    })
    const sumResult = await Booking.aggregate([
      {
        $match: {
          'item.home': { $in: homeIds },
          status: { $ne: 'Cancelled' }
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
    ]);


    const totalEarnings = sumResult.length > 0 ? sumResult[0].totalPrice : 0;

    console.log(totalEarnings, "totalEarnings");

    const totalBookings = bookings.length;
    console.log(totalBookings, "totalBookings")

    const userWithWallet = await User.findById(user._id).select('wallet');
    const formattedUserWallet = parseFloat(userWithWallet.wallet).toFixed(2);

    res.status(200).json({ totalEarnings, totalBookings, userWallet: formattedUserWallet });
  } catch (error) {
    console.error('Error fetching home details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export const getbookingHome = async (req, res) => {
  const { user } = req;


  try {
    const userHomes = await Home.find({
      userId: user._id,
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



export const Feedbackpost = async (req, res) => {
  try {
    const { user } = req;
    console.log(user, "user:......");
    const { homeId, star, feedback } = req.body;
    const newFeedback = new Feedback({
      userId: user._id,
      homeId: homeId,
      star: star,
      feedback: feedback,
      createDate: Date.now(),
    });
    const savedFeedback = await newFeedback.save();
    res.json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}


export const FeedbackByHome = async (req, res) => {
  try {
    const itemId = req.params.id;
    const feedback = await Feedback.find({ homeId: itemId }).populate('userId');
    res.json(feedback);
    console.log(feedback, "feedback::::")
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const updatestatusreservation = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {

    let updateFields = { status };


    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateedithome = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating home with ID:', id);
    const allImageUrls = [...req.body.imageUrls, ...(req.body.imageUrl || [])];

    const updatedHome = await Home.findByIdAndUpdate(id, { ...req.body, imageUrl: allImageUrls}, { new: true });

    res.json(updatedHome);
    console.log(updatedHome, "updateHome::")
  } catch (error) {
    console.error('Error updating home:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { user } = req

    console.log(bookingId, "bookingId:")
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, userId: user._id, status: 'Booked' },
      { $set: { status: 'Cancelled' } },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be cancelled.' });
    }
    const users = await User.findById({ _id: user._id });
    users.wallet += parseFloat(booking.totalPrice);
    await users.save();
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

export const getWallet = async (req, res) => {
  const { user } = req;
  try {
    const userwallet = User.find()
    console.log("userwallet:", userwallet)
    res.json(userwallet);
  } catch (error) {
    console.log(error)
  }

}


export const deleteImage=async(req,res)=>{
  const { id } = req.params;
  const { imageUrl } = req.body;
  try {
    // Find the document by ID and update the imageUrls field
    const updatedHome = await Home.findByIdAndUpdate(
        id,
        { $pull: { imageUrl: imageUrl } },
        { new: true }
    );
console.log("update",updatedHome)
    res.json(updatedHome);
} catch (error) {
    console.error('Error deleting image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}