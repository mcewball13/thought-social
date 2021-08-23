const router = require("express").Router();
const {
    getAllUsers,
    getUserById,
    createUsers,
    deleteUsers,
    updateUsers,
    addFriend,
    deleteUsersFriend
} = require("../../controllers/user-controllers");


router.route("/").get(getAllUsers).post(createUsers);


router.route("/:userId").get(getUserById).put(updateUsers).delete(deleteUsers);
router.route("/:userId/friends/:friendId").put(addFriend).delete(deleteUsersFriend);

module.exports = router;
