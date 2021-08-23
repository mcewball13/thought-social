const { Thoughts, Users } = require("../models");

const thoughtController = {
    getAllThoughts(req, res) {
        Thoughts.find({})
            .populate({
                path: "reactions",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUsersData) => res.json(dbUsersData))
            .catch((err) => {
                res.status(400).json(err);
                console.error(err);
            });
    },
    addThought({ body }, res) {
        console.log(body);
        Thoughts.create({
            thoughtText: body.thoughtText,
            username: body.username,
        })
            .then(({ _id }) => {
                return Users.findByIdAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No User data found with that id!",
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.json(err);
            });
    },
    addReaction({ params, body }, res) {
        console.log(body);
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then((dbReactionData) => {
                if (!dbReactionData) {
                    res.status(404).json({
                        message: "No Reaction found with that id",
                    });
                }
                res.json(dbReactionData);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log(err);
            });
    },
    // remove reply
    removeReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true }
        )
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.json(err));
    },
    removeThought({ body }, res) {
        Thoughts.findOneAndDelete({ _id: body.thoughtId })
            .then((deletedThought) => {
                if (!deletedThought) {
                    return res
                        .status(404)
                        .json({ message: "No Thought with this id!" });
                }
                return Users.findOneAndUpdate(
                    { _id: body.userId },
                    { $pull: { thoughts: { _id: body.thoughtId } } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "No User found with this id!",
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;
