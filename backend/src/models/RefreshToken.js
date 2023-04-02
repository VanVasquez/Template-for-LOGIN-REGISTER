const { Schema, model, SchemaTypes } = require("mongoose");

const refreshTokenSchema = new Schema({
  userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  token: { type: SchemaTypes.String, required: true },
  createdAt: { type: SchemaTypes.Date, default: Date.now, expires: 604800 }, // Expires after 7 days
});

module.exports = model("RefreshToken", refreshTokenSchema);
