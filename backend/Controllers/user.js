import User from "./../Models/User.js";

export const user = async (req, res) => {
  try {
    let existingUser = await User.findOne({ Email: req.body.email });

    if (existingUser) {
      return res.status(200).json(existingUser);
    } else {
      let newUser = new User({
        Email: req.body.email,
        Profile: req.body.profile,
        Name: req.body.name,
      });

      await newUser.save();
      await removeDuplicates(newUser.Email);
      return res.status(200).json(newUser);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

async function removeDuplicates(email) {
  try {
    const pipeline = [
      {
        $match: {
          Email: email,
        },
      },
      {
        $group: {
          _id: { Email: "$Email" },
          docs: { $push: "$_id" },
          firstId: { $first: "$_id" },
        },
      },
      {
        $match: {
          _id: { $ne: "$firstId" },
        },
      },
    ];

    const cursor = await User.aggregate(pipeline);

    cursor.forEach(async (doc) => {
      doc.docs.shift();
      await User.deleteMany({ _id: { $in: doc.docs } });
    });

    console.log("Duplicates removed successfully.");
  } catch (error) {
    console.error("Error removing duplicates:", error);
    throw error;
  }
}
export const updateUser = async (req, res) => {
  try {
    let user = await User.findOne({ Email: req.body.email });
    if (!user) {
      let newUser = new User({
        Email: req.body.email,
        Profile: req.body.profile,
        Name: req.body.name,
      });
      await newUser.save();
    }
    user = await User.findOne({ Email: req.body.email });

    if (!user.Solved.includes(`${req.body.number}. ${req.body.name}`)) {
      user.Solved.push(`${req.body.number}. ${req.body.name}`);
      user.Rating = user.Rating + req.body.rating;
      if (req.body.lavel == "Hard") user.Hard = user.Hard + 1;
      else if (req.body.lavel == "Easy") user.Easy = user.Easy + 1;
      else user.Medium = user.Medium + 1;
      await user.save();
    }
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    let user = await User.findOne({
      Email: req.body.email,
    });
    if (!user) {
      let newUser = new User({
        Email: req.body.email,
        Profile: req.body.profile,
        Name: req.body.name,
      });
      await newUser.save();
      user = await User.findOne({ Email: req.body.email });
    }
    user.SubmissionNumber = user.SubmissionNumber + 1;
    await user.save();
    return res
      .status(200)
      .json({ message: "Submission added successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNumber = async (req, res) => {
  try {
    let user = await User.findOne({ Email: req.body.email });
    if (!user) {
      let newUser = new User({ Email: req.body.email });
      await newUser.save();
      user = await User.findOne({
        Email: req.body.email,
        Profile: req.body.profile,
        Name: req.body.name,
      });
    }
    return res.status(200).json({ SolvedNumber: user.Solved.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRanking = async (req, res) => {
  try {
    const users = await User.find().sort({ Rating: -1 }).limit(9).exec();
    const currUser = await User.findOne({ Email: req.body.email });
    const userPosition = await User.countDocuments({
      Rating: { $gt: currUser.Rating },
    }).exec();
    currUser.SubmissionNumber = userPosition + 1;
    users.push(currUser);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCFID = async (req, res) => {
  try {
    let user = await User.findOne({ Email: req.body.email });
    user.CFID = req.body.cfId;
    await user.save();
    return res.status(200).json({ status: 1 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
