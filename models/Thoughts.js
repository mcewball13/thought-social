const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: "Comment Body Required!",
        maxLength: 280,
    },
    username: {
        type: String,
        required: "User Name Required!",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtValue) => dateFormat(createdAtValue),
    },
});

const ThoughtsSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: "Please write a thought",
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtValue) => dateFormat(createdAtValue),
        },
        username: {
            type: String,
            required: "Please write a username",
        },
        reactions: [ReactionSchema],
    },
    {
        toJSON: { virtuals: true, getters: true },
        id: false,
    }
);

ThoughtsSchema.virtual("reactionCount", function () {
    return this.reactions.length;
});

const Thoughts = model("Thoughts", ThoughtsSchema);
const Reaction = model("Reaction", ReactionSchema);

module.exports = { Thoughts, Reaction };
