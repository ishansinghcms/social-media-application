import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Communities from "../models/community.model.js";
import dayjs from "dayjs";

const getUser = async (req, res, next) => {
  try {
    // exclude password field
    const user = await User.findById(req.params.id).select("-password").lean();
    const totalPosts = Post.countDocuments({ user: user._id });
    const communities = Communities.find({ members: user._id });
    const totalCommunities = communities.length;
    const postCommunities = Post.find({ user: user._id }).distinct("community");
    const totalPostCommunities = postCommunities.length;

    const createdAt = dayjs(user.createdAt);
    const now = dayjs();
    const durationObj = dayjs.duration(now.diff(createdAt));
    const durationMinutes = durationObj.asMinutes();
    const durationHours = durationObj.asHours();
    const durationDays = durationObj.asDays();

    user.totalPosts = totalPosts;
    user.totalCommunities = totalCommunities;
    user.totalPostCommunities = totalPostCommunities;
    user.duration = "";

    if (durationMinutes < 60) {
      user.duration = `${Math.floor(durationMinutes)} minutes`;
    } else if (durationHours < 24) {
      user.duration = `${Math.floor(durationHours)} hours`;
    } else if (durationDays < 365) {
      user.duration = `${Math.floor(durationDays)} days`;
    } else {
      const durationYears = Math.floor(durationDays / 365);
      user.duration = `${durationYears} years`;
    }

    const posts = Post.find({ user: user._id })
      .populate("community", "name members")
      .limit(20)
      .lean()
      .sort({ createdAt: -1 });

    user.posts = posts.map((post) => ({
      ...post,
      isMember: post.community?.members
        .map((member) => member.toString())
        .includes(user._id.toString()),
      createdAt: createdAt,
    }));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
