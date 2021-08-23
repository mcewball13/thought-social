const { Schema, model, Types } = require("mongoose");

const UsersSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "User Name is Required!"],
            trimmed: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is Required!"],
            unique: true,
            match: [/.+@.+\..+/],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thoughts",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "Users",
            },
        ],
    },
    {
        toJSON: { virtuals: true, getters: true },
        id: false,
    },
);

UsersSchema.virtual("friendCount", function () {
    return this.friends.length;
});

const Users = model("Users", UsersSchema);

module.exports = { Users };
