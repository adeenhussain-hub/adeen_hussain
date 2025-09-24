const discoverModel = require("../models/discoverModel");
const { validationResult } = require("express-validator");

const model = new discoverModel();
class discoverController {

    async showFeed(req, res) {
        try {
            const followerId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;


            const result = await model.showFeed(followerId, limit, offset);
            if (result.length === 0) return res.status(200).json({ message: "User has no following" });

            return res.status(200).json({ message: "Your Feed", feed: result });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async showTrendingFeed(req, res) {
        try {
            const userId = req.user.id;
            console.log(userId);

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;


            const result = await model.showTrendingFeed(userId, limit, offset);
            if (result.length === 0) return res.status(200).json({ message: "Error Loading" });

            return res.status(200).json({ message: "Your Trending Feed", feed: result });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async suggestedUser(req, res) {
        try {
            const userId = req.user.id;
            const userDetails = await model.findUserByID(userId);

            const mutualFollowers = await model.showMutualFollowers(userId);
            const trendingUsers = await model.showTrendingUsers(userId);
            if (mutualFollowers.length === 0 ) return res.status(400).json({ message: "Error Loading" });

            return res.status(200).json({ message: "Suggested User", mutual_Followers: {results: mutualFollowers,Followed_By: { userID: userDetails.id, user_name: userDetails.username } } ,Trending_Users : trendingUsers} );
            return res.status(200).json({ message: "Suggested User", result: mutualFollowers, Followed_By: { userID: userDetails.id, user_name: userDetails.username } });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
}

module.exports = new discoverController();