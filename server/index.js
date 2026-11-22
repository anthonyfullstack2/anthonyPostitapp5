import mongoose from "mongoose";
import cors from "cors";
import express from "express";

import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";

import PostModel from "./Models/Posts.js";

const app = express();
//Middleware
const corsOptions = {
  //origin: ENV.CLIENT_URL, //client URL local
  //5173
  origin: "http://localhost:3000", //client URL local
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

//cors - cross-origin resource sharing
//It tells your backend which frontend application is allowed to communicate with it.
//When React sends a request to Express, the CORS middleware checks whether the request is allowed based on your CORS configuration.
//Without properly configured CORS, the browser may block requests from your frontend.
app.use(cors(corsOptions));

//This allows Express to read JSON data sent by the frontend.
app.use(express.json());

//Database connection
//const connectString = "";
const connectString =
  "mongodb+srv://user1:user12345@postitcluster.gh87xkw.mongodb.net/postITDb?appName=PostITCluster";

// Connect to MongoDB
mongoose
  .connect(connectString)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start Express server only after database connection
    app.listen(3001, () => {
      console.log("You are connected");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:");
  });

//---------API for registering a new user------------------------
app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//---------up to here for API for registering a new user-------------

//-----------api for login ----------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; //using destructuring
    //search the user
    const user = await UserModel.findOne({ email: email });
    //if not found
    if (!user) {
      return res.status(500).json({ error: "User not found." });
    }
    console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    //if everything is ok, send the user and message
    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//-----------up to here for api for login ----------------------

//-------api for logout-------------------------------
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
//-------up to here for api for logout----------------

//-----POST API - savePost-------------------
app.post("/savePost", async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;
    const post = new PostModel({
      postMsg: postMsg,
      email: email,
    });
    await post.save();
    res.send({ post: post, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//-----up to here for POST API - savePost--------------

//------GET API (getPost) for getting all the post documents from the posts collection
app.get("/getPosts", async (req, res) => {
  try {
    // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
    const posts = await PostModel.find({}).sort({ createdAt: -1 });
    const countPost = await PostModel.countDocuments({});
    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
//------up to here for GET API (getPost) for getting all the post documents from the posts collection

//----API for like post-----------
app.put("/likePost/:postId/", async (req, res) => {
  const postId = req.params.postId; //Extract the ID of the post from the URL
  const userId = req.body.userId;
  try {
    //search the postId if it exists
    const postToUpdate = await PostModel.findOne({ _id: postId });

    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post not found." });
    }

    //Search the user Id from the array of users who liked the post.
    const userIndex = postToUpdate.likes.users.indexOf(userId);

    //indexOf method returns the index of the first occurrence of a specified value in an array.
    //If the value is not found, it returns -1.

    //This code will toogle from like to unlike
    if (userIndex !== -1) {
      // User has already liked the post, so unlike it
      const udpatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators
          $pull: { "likes.users": userId }, // Remove userId from the users array
        },
        { new: true }, // Return the modified document
      );

      res.json({ post: udpatedPost, msg: "Post unliked." });
    } else {
      // User hasn't liked the post, so like it
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": 1 }, // Increment the like count
          $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present
        },
        { new: true }, // Return the modified document
      );

      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
//----up to here for API for like post-----------

/*
import mongoose from "mongoose";
import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());
app.use(cors());

//Database connection
const connectString =
  "mongodb+srv://user1:user12345@postitcluster.gh87xkw.mongodb.net/postITDb?retryWrites=true&w=majority&appName=postitcluster";
mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3001, () => {
  console.log("You are connected");
});
*/
