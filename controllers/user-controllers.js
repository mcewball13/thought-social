const { Users } = require("../models");

const userController = {
    getAllUsers(req, res) {
        Users.find({})
            .populate({
                path: "friends",
                select: "-__v",
            })
            .populate("thoughts", "thoughtText")
            .select("-__v")
            .then((dbUsersData) => res.json(dbUsersData))
            .catch((err) => {
                res.status(400).json(err);
                console.error(err);
            });
    },
    getUserById({ params }, res) {
        Users.findOne({ _id: params.userId })
            .populate({ path: "friends", select: "-__v" })
            .select("-__v")

            .then((dbUsersData) => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: "No Users Found with this id",
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log(err);
            });
    },
    createUsers({ body }, res) {
        Users.create(body)
            .then((dbUsersData) => res.json(dbUsersData))
            .catch((err) => res.status(400).json(err));
    },
    updateUsers({ params, body }, res) {
        Users.findOneAndUpdate({ _id: params.userId }, body, { new: true })
            .then((dbUsersData) => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: "No Users exists with that id!",
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log(err);
            });
    },
    deleteUsers({ params }, res) {
        Users.findByIdAndDelete({ _id: params.userId })
            .then((dbUsersData) => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: "No Users found with that id!",
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log(err);
            });
    },
    addFriend({ params, body }, res) {
        console.log(body);
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true }
        )
            .then((dbFriendData) => {
                if (!dbFriendData) {
                    res.status(404).json({
                        message: "No User found with that id",
                    });
                }
                res.json(dbFriendData);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log(err);
            });
    },
    deleteUsersFriend({ params }, res) {
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((dbFriendData) => res.json(dbFriendData))
            .catch((err) => res.json(err));
    },
};

module.exports = userController;
