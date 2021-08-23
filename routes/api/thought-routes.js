const router = require("express").Router();

const {
    addThought,
    addReaction,
    removeReaction,
    removeThought,
    getAllThoughts,
} = require("../../controllers/thought-controller");

// add get routes for all comments
router.route("/").get(getAllThoughts).post(addThought).delete(removeThought);
router.route("/:thoughtId").post(addReaction);
router.route("/:thoughtId/reactions").delete(removeReaction);

module.exports = router;
