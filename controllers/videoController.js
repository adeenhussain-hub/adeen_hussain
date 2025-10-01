const videoModel = require("../models/videoModel");
const { validationResult } = require("express-validator");
// const {startswith}

const model = new videoModel();

class videoController {
    // Videos-----------------------------------------------------
    async createVideo(req, res) {
        try {
            const createdBy = req.user.id;
            // console.log(createdBy);

            const { title, description } = req.body;
            const videoPath = req.file ? `/uploads/${req.file.filename}` : null
            console.log(req.file.mimetype);

            if (!req.file.mimetype.startsWith('video/')) return res.status(400).json({ message: "Only Video is Allowed" })

            if (!req.file.mimetype.startsWith('video/')) return res.status(400).json({ message: "Only Video is Allowed" })

            if (!videoPath) return res.status(400).json({ message: "Video Required" })

            await model.addVideo({ title, description, videoPath: videoPath, createdBy });

            return res.status(200).json({ message: "Video Posted Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async getVideoById(req, res) {
        try {
            const { id } = req.params;
            const video = await model.getVideoById(id);

            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }

            return res.status(200).json(video);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async deleteVideo(req, res) {
        try {
            const userId = req.user.id;

            const videoID = req.params.id;
            if (!videoID) return res.status(404).json({ message: "Video Id required" });

            const videoDetail = await model.getVideoById(videoID)
            if (!videoDetail) {
                return res.status(404).json({ message: "Video not found" });
            }
            if (userId !== videoDetail.createdBy) return res.status(403).json({ message: "Access Denied Only Owner is allowed to delete" })
            console.log(videoDetail);

            await model.deleteVideo(videoID);
            return res.status(200).json({ message: "Deleted Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async likeVideo(req, res) {
        try {
            const userId = req.user.id;
            const videoId = req.params.id;


            const FindVideo = await model.getVideoById(videoId)
            if (!FindVideo) {
                return res.status(400).json({ message: "Video Not Found" });
            }
            const videoOwnerId = FindVideo.createdBy;
            // console.log(videoOwnerId)
            const blockedByUser = await model.isBlocked(videoOwnerId, userId)
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }

            await model.likeVideoById(userId, videoId);
            await model.updateLikesCount("+", videoId);
            return res.status(200).json({ message: "Video Liked SuccessFully" });
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "You already liked this video" });
            }
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async unlikeVideo(req, res) {
        try {
            const userId = req.user.id;
            const videoId = req.params.id;

            const FindVideo = await model.getVideoById(videoId)
            if (!FindVideo) {
                return res.status(400).json({ message: "Video Not Found" });
            }
            const videoOwnerId = FindVideo.createdBy;
            // console.log(videoOwnerId)
            const blockedByUser = await model.isBlocked(videoOwnerId, userId)
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }

            // const isBlocked = await model.isBlocked(userId, req.user.id)
            // if (isBlocked) return res.status(403).json({ message: "You are blocked" });

            await model.unlikeVideoById(userId, videoId);
            await model.updateLikesCount("-", videoId);
            return res.status(200).json({ message: "Video unliked SuccessFully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }

    async searchVideos(req, res) {
        // console.log('jdiwdid');
        try {
            const userId = req.user.id;
            const query = req.query.query || "";
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const videos = await model.searchVideos(userId, query, limit, offset);

            return res.status(200).json({ message: "Search results", page, limit, results: videos.length, videos });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async getVideosByUploaderId(req, res) {
        try {
            const id = req.params.id

            const isBlocked = await model.isBlocked(id, req.user.id)
            if (isBlocked) return res.status(403).json({ message: "You are blocked" });

            const videosByUploaderId = await model.videosUploaderById(id);

            return res.status(200).json({ message: "Search results", results: videosByUploaderId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async videosLikedById(req, res) {
        try {
            const id = req.params.id

            const isBlocked = await model.isBlocked(req.user.id, id)
            const isBlocked2 = await model.isBlocked(id, req.user.id)
            if (isBlocked || isBlocked2) return res.status(403).json({ message: "You are blocked for this action" });

            const videosByUploaderId = await model.videosLikedById(id);

            return res.status(200).json({ message: "Videos Liked By Id", results: videosByUploaderId });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async toggleVideoLike(req, res) {
        try {
            const userId = req.user.id;
            const videoId = req.params.id;

            const FindVideo = await model.getVideoById(videoId)
            if (!FindVideo) {
                return res.status(400).json({ message: "Video Not Found" });
            }

            const videoOwnerId = FindVideo.createdBy;
            const blockedByUser = await model.isBlocked(videoOwnerId, userId)
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }

            const isLiked = await model.isVideoLiked(videoId, userId);

            if (!isLiked) {
                await model.likeVideoById(userId, videoId);
                await model.updateLikesCount("+", videoId);
                return res.status(200).json({ message: "Video Liked Successfully" });
            } else {
                await model.unlikeVideoById(userId, videoId);
                await model.updateLikesCount("-", videoId);
                return res.status(200).json({ message: "Video Unliked Successfully" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    // Comments-----------------------------------------------------
    async getAllComments(req, res) {
        try {
            const videoId = req.params.id;
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const comments = await model.getAllCommentsOnVideo(videoId, userId, limit, offset);
            if (comments.length === 0) return res.status(404).json({ message: "Comment Not Found" });

            return res.status(200).json({ message: "Comments fetched successfully", count: comments.length, comments: comments });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async addComentsOnVideo(req, res) {
        try {
            const userId = req.user.id;
            const videoId = req.params.id;
            const parentId = req.body.parentId ?? null;
            const { content } = req.body;

            const FindVideo = await model.getVideoById(videoId)
            if (!FindVideo) return res.status(400).json({ message: "Video Not Found" });
            const videoOwnerId = FindVideo.createdBy;
            // console.log(videoOwnerId)
            const blockedByUser = await model.isBlocked(videoOwnerId, userId)
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId)

            if (blockedByOwner || blockedByUser) return res.status(403).json({ message: "You are blocked from this action" });

            if (!videoId) return res.status(400).json({ message: "Video Id required" })
            if (!content) return res.status(400).json({ message: "Comment is required" })

            //---------------------------------------------------------------
            if (parentId) {
                const checkCommentExsisting = await model.getCommentById(parentId)
                if (!checkCommentExsisting) return res.status(400).json({ message: "Comment Not Found To Reply" })
            }
            //---------------------------------------------------------------

            await model.addComment(videoId, userId, content, parentId)
            await model.updateCommentsCount("+", videoId)

            return res.status(200).json({ message: "Comment Added Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async deleteComment(req, res) {
        try {
            const userId = req.user.id;
            const commentId = req.params.id;

            const comment = await model.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({ message: "Comment Not Found" });
            }

            const video = await model.getVideoById(comment.videoId);
            if (!video) return res.status(404).json({ message: "Video Not Found" });

            const videoOwnerId = video.createdBy;

            const blockedByUser = await model.isBlocked(videoOwnerId, userId);
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId);
            if (blockedByOwner || blockedByUser) return res.status(403).json({ message: "You are blocked from this action" });

            if (comment.userId !== userId && video.createdBy !== userId) return res.status(403).json({ message: "Unauthorized" })

            await model.deleteComment(commentId);
            await model.updateCommentsCount("-", comment.videoId);

            return res.status(200).json({ message: "Comment Deleted Successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async toggleCommentLike(req, res) {
        try {
            const userId = req.user.id;
            const commentId = req.params.id;
            const commentIsLiked = await model.isCommentLiked(commentId, userId);

            const checkCommentExists = await model.getCommentById(commentId)
            if (!checkCommentExists) return res.status(404).json({ message: "Comment Not Found to like" });

            if (!commentIsLiked) {
                await model.likeComment(commentId, userId)
                await model.updateCommentsLikesCount("+", commentId)
                return res.status(200).json({ message: "Comments Liked SuccessFully" });
            }
            await model.unlikeComment(commentId, userId)
            await model.updateCommentsLikesCount("-", commentId)
            return res.status(200).json({ message: "Comments DisLiked SuccessFully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async editComment(req, res) {
        try {
            const userId = req.user.id;
            const commentId = req.params.id;
            const { comments } = req.body;

            if (!comments) return res.status(400).json({ message: "Comment is required" })

            const getComment = await model.getCommentById(commentId);
            if (!getComment) {
                return res.status(404).json({ message: "Comment Not Found" });
            }

            if (getComment.userId !== userId) return res.status(403).json({ message: "Unauthorized" })


            const s = await model.editComment(comments, commentId)
            console.log(s);


            return res.status(200).json({ message: "Comment Updated Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    async getCommentsReplies(req, res) {
        try {
            const commentId = req.params.id;
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const replies = await model.getAllRepliesOnCommentsById(commentId, userId, limit, offset);
            if (replies.length === 0) return res.status(404).json({ message: "Reply Not Found" });

            return res.status(200).json({ message: "Comment's Replies fetched successfully", count: replies.length, comments: replies });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });
        }


    }
    async viewVideo(req, res) {
        try {
            const userId = req.user.id;
            const videoId = req.params.id;

            const FindVideo = await model.getVideoById(videoId)
            if (!FindVideo) {
                return res.status(400).json({ message: "Video Not Found" });
            }
            const videoOwnerId = FindVideo.createdBy;
            const blockedByUser = await model.isBlocked(videoOwnerId, userId)
            const blockedByOwner = await model.isBlocked(userId, videoOwnerId)

            if (blockedByOwner || blockedByUser) {
                return res.status(403).json({ message: "You are blocked from this action" });
            }
            const lastView = await model.getViewRecordById(userId, videoId)

            if (lastView) {
                const lastViewedAt = new Date(lastView.viewed_at);
                const now = new Date();
                const diffHours = (now - lastViewedAt) / (1000 * 60 * 60); // Convert ms → hours

                if (diffHours < 24) {
                    return res.status(200).json({ message: "View already counted within 24 hours" });
                }
            }

            await model.addView(userId, videoId)
            await model.increamentViewCount(videoId)

            return res.status(201).json({ message: "Video Viewed Successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }
    }
}

module.exports = new videoController();