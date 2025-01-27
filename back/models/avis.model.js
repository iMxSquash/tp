const mongoose = require("mongoose");

const AvisSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle "User"
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article", // Référence au modèle "Article"
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Note entre 1 et 5
    },
    comment: {
      type: String,
      required: true, // Commentaire obligatoire
    },
  },
  {
    timestamps: { createdAt: true }, // Ajoute automatiquement `createdAt`
  }
);

module.exports = mongoose.model("Avis", AvisSchema);
