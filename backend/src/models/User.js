const { Schema, SchemaTypes, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: SchemaTypes.String, required: true },
    password: { type: SchemaTypes.String, required: true },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
