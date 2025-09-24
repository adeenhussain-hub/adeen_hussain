const profileModel = require("../models/profileModel");
const { validationResult } = require("express-validator");

const model = new profileModel();
class profileController {
    async follow(req, res) {
        try {
            const followerId = req.user.id;
            // console.log(followerId,"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            const followingId = Number(req.params.id)
            if (!followingId) return res.status(400).json({ message: "userId is Required" });

            const blockedByUser = await model.isBlocked(followingId, followerId)
            const blockedByOwner = await model.isBlocked(followerId, followingId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }


            if (followerId === followingId) return res.status(400).json({ message: "You can't follow your self" });

            await model.followUserById(followerId, followingId);
            await model.updateTotalFollowing("+", followerId);
            await model.updateTotalFollowers("+", followingId)

            return res.status(200).json({ message: "Follow Successfully" });

        } catch (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Already following this user" });
            }
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async unFollow(req, res) {
        try {
            const followerId = req.user.id;
            // console.log(followerId,"oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            const followingId = req.params.id;
            if (!followingId) return res.status(400).json({ message: "followingId is Required" });

            const blockedByUser = await model.isBlocked(followingId, followerId)
            const blockedByOwner = await model.isBlocked(followerId, followingId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }

            const result = await model.unFollow(followerId, followingId);
            if (!result) return res.status(400).json({ message: "Your are not following this user" });
            await model.updateTotalFollowing("-", followerId);
            await model.updateTotalFollowers("-", followingId)

            return res.status(200).json({ message: "Unfollow Successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async getAllFollowingsByID(req, res) {
        try {
            const id = req.params.id

            if (req.headers.authorization) {
                const blockedByUser = await model.isBlocked(id, req.user.id)
                const blockedByOwner = await model.isBlocked(req.user.id, id)
                if (blockedByOwner || blockedByUser) {
                    return res.status(403).json({ message: "You are blocked from this action" });
                }
            }
            const followings = await model.getfollowingsById(id);

            if (followings.length === 0) return res.status(200).json({ message: "User is not following anyone" });

            return res.status(200).json({ message: "Here is all Followings Of User", results: followings });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async getAllFollowerssByID(req, res) {
        try {
            const id = req.params.id

            if (req.headers.authorization) {
                const blockedByUser = await model.isBlocked(id, req.user.id)
                const blockedByOwner = await model.isBlocked(req.user.id, id)
                if (blockedByOwner || blockedByUser) {
                    return res.status(403).json({ message: "You are blocked from this action" });
                }
            }
            const followings = await model.getFollowersById(id);

            return res.status(200).json({ message: "Here is all Followers Of User", results: followings });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async stats(req, res) {
        try {
            const id = req.params.id
            if (req.headers.authorization) {
                const blockedByUser = await model.isBlocked(id, req.user.id)
                const blockedByOwner = await model.isBlocked(req.user.id, id)
                if (blockedByOwner || blockedByUser) {
                    return res.status(403).json({ message: "You are blocked from this action" });
                }
            }
            const result = await model.getStats(id);
            if (result.length === 0) return res.status(200).json({ message: "Error Loading" });

            return res.status(200).json({ message: "Successfully Loaded", results: result });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async block(req, res) {
        try {
            const blockerId = req.user.id;
            const blockedId = Number(req.params.id);
            if (!blockerId) return res.status(400).json({ message: "userId is Required" });

            if (blockerId === blockedId) return res.status(400).json({ message: "You can't block yourself" });

            await model.block(blockerId, blockedId);

            return res.status(200).json({ message: "Blocked Successfully" });

        } catch (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Already Blocked this user" });
            }
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async unBlock(req, res) {
        try {
            const blockerId = req.user.id;
            const blockedId = Number(req.params.id);
            if (!blockerId) return res.status(400).json({ message: "userId is Required" });

            if (blockerId === blockedId) return res.status(400).json({ message: "You can't unblock yourself" });

            const result = await model.unBlock(blockerId, blockedId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Not blocked" });
            }
            return res.status(200).json({ message: "Unblocked Successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
}

module.exports = new profileController();