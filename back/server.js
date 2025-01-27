const dotenv = require('dotenv');
const fs = require('fs');
const multer =  require('multer'); 
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileURLToPath = require('url');
const Article = require('./models/article.model.js');
const Model = require('./models/user.model.js');
const Avis = require('./models/avis.model.js') 

const dirname = path.dirname(__filename);

dotenv.config()

const env = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_URI_LOCAL: process.env.MONGO_URI_LOCAL,
  TOKEN: process.env.TOKEN,
  PORT_FRONT: process.env.PORT_APP_FRONT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS

}
const app = express()

const PORT = env.PORT || 8080

const routerArticle = express.Router();
const routerUser = express.Router();
const routerAvis = express.Router();

mongoose
  .connect(env.MONGO_URI, {dbName: env.DB_NAME})
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(error => console.log(error))

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", routerUser)
app.use("/api/article", routerArticle)
app.use("/api/avis", routerAvis)

app.listen(PORT, () => {
  console.log(`LISTENING AT http://localhost:${PORT}`)
})

const uploadFolder = path.join(dirname, './uploads');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
  console.log('Dossier "uploads" créé');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {    
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const sendEmail = async (user, verifieToken) => {
  const verificationLink = `<a href='${env.PORT_FRONT}/verify/${verifieToken}'>${verifieToken}</a> `;

  await transporter.sendMail({
    from: env.EMAIL_USER, 
    to: user.email, 
    subject: "Vérifiez votre email", 
    text: `Hello ${user.name},\n\nMerci de vous être inscrit\n\nCordialement.`,
    html: `Cliquez sur ce lien pour vérifier votre email : ${verificationLink}`, 
  });
};

const createError = (status, message) => {
  const error = new Error()
  error.status = status
  error.message = message
  return error
}

const verifieToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });

  jwt.verify(token, process.env.TOKEN, (err, user) => {
      if (err) {
          console.error("Token invalide :", err);
          return res.status(403).json({ message: "Token invalide." });
      }
      console.log("Utilisateur authentifié :", user); // Vérifie l'utilisateur
      req.user = user;
      next();
  });
};

const postArticle = async (req, res) => {
  try {
    const images = req.files; 
    let pathImgExtrated = {};
    
    if (images && images.length > 0) {
      pathImgExtrated = images.reduce((acc, file, index) => {
        if (index === 0) {
          acc.img = `/uploads/${file.filename}`;
        } else {
          acc[`img${index}`] = `/uploads/${file.filename}`;
        }
        return acc;
      }, {});
    } else {
      pathImgExtrated = { img: '/uploads/default.jpg' };
    }
    
    const article = await Article.create({...req.body, picture: pathImgExtrated });
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getAllArticle = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error lors de la récupération" });
  }
};

const oneArticle =
  ("/article/:id",
  async (req, res) => {
    try {
      const id = req.params.id;
      const article = await Article.findById(id);
      res.status(200).json(article);
    } catch (err) {
      res.status(500).json({ error: "Error lors de la récupération" });
    }
  });

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
      return res.status(200).json(article)
  } catch (err) {
    res.status(500).json({ error: "Error lors de la récupération" });
  }
};

const deleteArticle = async (req, res) => {
  try {
      const article = await Article.findByIdAndDelete(req.params.id);
      res.status(200).json("Article deleted ! ");
  } catch (err) {
    res.status(500).json({ error: "Error lors de la récupération" });
  }
};

const adminUpdateArticle = async (req, res) => {
  try {
    let updateData = {};
    
    const fields = ['name', 'content', 'category', 'brand', 'price', 'stock', 'status'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.file) {
      updateData.picture = {
        img: `/uploads/${req.file.filename}`
      };
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!article) {
      return res.status(404).json({ error: "Article not found!" });
    }
    
    res.status(200).json(article);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(500).json({ error: "Error updating article", details: error.message });
  }
};


const adminDeleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json("Article not found!");
    res.status(200).json("Article successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting article" });
  }
};

const ascArticle = async (req, res) => {
  try {
    const articles = await Article.find().sort("price");
    res.status(200).json(articles);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors du tri des articles par price" });
  }
};

const descArticle = async (req, res) => {
  try {
    const articles = await Article.find().sort("-price");
    res.status(200).json(articles);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors du tri des articles par price" });
  }
};

const avisByArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("avis");
    res.status(200).json(article.avis);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const sortedByNote = async (req, res) => {
  try {
    const articles = await Article.aggregate([
      {
        $lookup: {
          from: "avis", 
          localField: "_id", 
          foreignField: "article", 
          as: "avis", 
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$avis.rating" }, 
        },
      },
      {
        $sort: { averageRating: -1 }, 
      },
    ]);

    if (!articles || articles.length === 0) return res.status(404).json({ error: "Aucun article trouvé!" });
    res.status(200).json(articles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des articles!" });
  }
};


const signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await Model.create({
      ...req.body,
      password: hashedPassword,
      isVerified: false,
      isActive: true, // Assurez-vous que l'utilisateur est actif par défaut
      role: req.body.role || 'user' // Utilise le rôle fourni ou 'user' par défaut
    })
    const verificationToken = jwt.sign({ id: user._id }, env.TOKEN, { expiresIn: '1d' });
    await sendEmail(req.body, verificationToken)
    res.status(201).json({message: 'User add and Email envoyé'})
  } catch(err) {
    console.error('Erreur : ', err);
    next(createError(500, err))
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, env.TOKEN);
    const updatedUser = await Model.findByIdAndUpdate(
      decoded.id, 
      { isVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé',
        isVerified: false
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Email vérifié avec succès !',
      isVerified: updatedUser.isVerified 
    });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        success: false,
        message: 'Token invalide',
        error: error.message 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        success: false,
        message: 'Le lien de vérification a expiré',
        error: error.message 
      });
    }
    res.status(400).json({ 
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message 
    });
  }
};

const sign = async (req, res, next) => {
  try {
    const user = await Model.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not Found!");

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Veuillez vérifier votre email pour accéder à cette fonctionnalité." });
    }

    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    if (!comparePassword) return res.status(400).json("Wrong Credentials!");

    const token = jwt.sign(
      { id: user._id },
      env.TOKEN,
      { expiresIn: "24h" }
    );

    const { password, ...others } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // Met à true si ton application est en HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    // Inclure le token dans la réponse JSON
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const logout = async (req, res) => {
  try {
    res.clearCookie('access_token', {
      secure: false,
      sameSite: 'strict'
    });
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
};

const getUsers = async (req, res) => {
  try{
    const users = await Model.find()
    res.status(200).json(users)
  }catch(error){
    console.log(error);
  }
}

const getUserById = async (req, res) =>  {
  try{  
    const user = await Model.findById(req.params.id)
    if(user) res.status(200).json(user)
    if(!user) res.status(404).json("User not found !")
  }catch(error){
    console.log(error);
  }
}

const deleteUser = async (req, res, next) => {
  try{
    const user = await Model.findById(req.params.id)
    if (!user) return res.status(404).json("User not found.")
    if (user._id.toString() !== req.user.id) return res.status(403).json("Accès refusé!.");
    user.isActive = false;
    await user.save();
    res.status(200).json(`The User with the id ${req.params.id} has been deleted.`)
  }catch(error){
    console.log(error)
  }
};

const reactivateUser = async (req, res, next) => {
  try {
    const user = await Model.findById(req.params.id);
    if (!user) return res.status(404).json("User not found.");
    if (user._id.toString() !== req.user.id)
      return res.status(403).json("Accès refusé.");
    if (user.isActive) return res.status(400).json("The account is already active.");
    user.isActive = true;
    await user.save();
    res.status(200).json(`The User with the id ${req.params.id} has been reactivated.`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while reactivating the user." });
  }
};


const updateUser = async (req, res, next) => {
  try{
    const user = await Model.findById(req.params.id);
    if(!user) return res.status(404).json("user not found !");
    if(req.user.id != user._id.toString()){
      return res.status(403).json("Accès refusé!");
    }
    const userUpdated = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json({
      message: "User updated",
      userUpdated
    })
  }catch(error){
    console.log(error)
  }
}

const updateUserAdmin = async (req, res) => {
  try {
    const userUpdated = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!userUpdated) return res.status(404).json("User not found!");
    res.status(200).json(userUpdated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating user" });
  }
};

const adminDeactivateUser = async (req, res) => {
  try {
    const user = await Model.findById(req.params.id);
    if (!user) return res.status(404).json("User not found.");
    user.isActive = false;
    await user.save();
    res.status(200).json(`User with id ${req.params.id} has been deactivated.`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deactivating user" });
  }
};

const adminReactivateUser = async (req, res) => {
  try {
    const user = await Model.findById(req.params.id);
    if (!user) return res.status(404).json("User not found.");
    user.isActive = true;
    await user.save();
    res.status(200).json(`User with id ${req.params.id} has been reactivated.`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error reactivating user" });
  }
};

const postAvis = async (req, res ) => {
  try{
    const avis = await Avis.create({...req.body, user: req.user.id})
    const article = await Article.findByIdAndUpdate(req.params.articleId, 
      { 
        $push: { 
          avis: avis._id 
        }
      }, 
      { new: true })
    res.status(201).json("Avis add !")
  }catch(error){
    res.status(500).json({error: "Erreur lors de la création de l'avis!"})
  }
}

const deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.avisId);
    if (!avis) return res.status(404).json({ error: "Avis non trouvé!" });
    if (avis.user.toString() !== req.user.id) return res.status(403).json({ error: "Accès refusé!" });
        await avis.remove();
    await Article.findByIdAndUpdate(avis.article, { $pull: { avis: req.params.avisId }});
    res.status(200).json({ message: "Avis supprimé avec succès!" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'avis!" });
  }
}

const updateAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.avisId);
    if (!avis) return res.status(404).json({ error: "Avis non trouvé!" });
    if (avis.user.toString() !== req.user.id) 
      return res.status(403).json({ error: "Accès refusé!" });
    const updatedAvis = await Avis.findByIdAndUpdate(
      req.params.avisId,
      { ...req.body }, 
      { new: true } 
    );
    res.status(200).json({ message: "Avis modifié avec succès!", avis: updatedAvis });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification de l'avis!" });
  }
};

routerAvis.post('/add/:articleId', verifieToken, async (req, res) => {
  try {
      const { comment, rating } = req.body;
      const articleId = req.params.articleId;

      // Création de l'avis
      const avis = await Avis.create({
          user: req.user.id, // ID de l'utilisateur récupéré à partir du token
          article: articleId,
          rating,
          comment,
      });

      // Mise à jour de l'article pour inclure cet avis
      await Article.findByIdAndUpdate(articleId, { $push: { avis: avis._id } });

      res.status(201).json({ message: 'Avis ajouté avec succès !', avis });
  } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis :", error);
      res.status(500).json({ error: 'Erreur lors de l’ajout de l’avis !' });
  }
});

app.use("/api/avis", routerAvis);


routerAvis.get('/article/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate({
      path: 'avis',
      populate: { path: 'user', select: 'prenom' }, // Sélectionne le prénom ou name
    });
    res.status(200).json(article.avis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des avis !' });
  }
});



const AvisSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence au modèle User
});

// Vérifie si le modèle existe déjà avant de le déclarer
module.exports = mongoose.models.Avis || mongoose.model('Avis', AvisSchema);


routerAvis.delete('/delete/:avisId', async (req, res) => {
  try {
    console.log("ID de l'avis reçu :", req.params.avisId);

    // Vérification si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.avisId)) {
      console.log("ID d'avis invalide !");
      return res.status(400).json({ error: "ID d'avis invalide !" });
    }

    const avis = await Avis.findById(req.params.avisId);
    if (!avis) {
      console.log("Avis non trouvé !");
      return res.status(404).json({ error: 'Avis non trouvé !' });
    }

    console.log("ID utilisateur de l'avis :", avis.user.toString());
    if (avis.user.toString() !== req.body.userId && req.body.role !== 'admin') {
      console.log("Accès refusé. Non autorisé !");
      return res.status(403).json({ error: 'Accès refusé !' });
    }

    console.log("Suppression de l'avis...");
    // Utilisation de deleteOne() pour supprimer l'avis
    await Avis.deleteOne({ _id: req.params.avisId });
    await Article.findByIdAndUpdate(avis.article, { $pull: { avis: req.params.avisId } });

    console.log("Avis supprimé avec succès !");
    res.status(200).json({ message: 'Avis supprimé avec succès !' });
  } catch (error) {
    console.error("Erreur interne :", error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’avis !' });
  }
});



routerAvis.put('/update/:avisId', verifieToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.avisId)) {
      return res.status(400).json({ error: "ID d'avis invalide !" });
    }

    const avis = await Avis.findById(req.params.avisId);
    if (!avis) {
      return res.status(404).json({ error: "Avis non trouvé !" });
    }

    // Vérifie si l'utilisateur est le créateur de l'avis
    if (avis.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé !" });
    }

    // Met à jour l'avis
    avis.comment = comment || avis.comment;
    avis.rating = rating || avis.rating;

    const updatedAvis = await avis.save();

    res.status(200).json({ message: "Avis modifié avec succès !", avis: updatedAvis });
  } catch (error) {
    console.error("Erreur lors de la modification de l'avis :", error);
    res.status(500).json({ error: "Erreur interne lors de la modification de l'avis !" });
  }
});


app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Route test OK' });
});


routerArticle.post("/add", upload.array('img', 5), postArticle);
routerArticle.get("/all", getAllArticle);
routerArticle.get("/get/:id", oneArticle);
routerArticle.put("/update/:id",verifieToken, updateArticle);
routerArticle.delete("/delete/:id",verifieToken, deleteArticle);
routerArticle.get("/asc", ascArticle);
routerArticle.get("/desc", descArticle);
routerArticle.get("/avis/:id", avisByArticle);
routerArticle.get("/note", sortedByNote);

routerArticle.delete("/admin/delete/:id", adminDeleteArticle);
routerArticle.put("/admin/update/:id", upload.single('img'), adminUpdateArticle)

routerUser.post("/signup", signup);
routerUser.post("/sign", sign);
routerUser.put("/verify/:token", verifyEmail)
routerUser.get("/get", getUsers);
routerUser.get("/get/:id", getUserById);
routerUser.put("/delete/:id",verifieToken, deleteUser);
routerUser.put("/reactivate/:id", verifieToken, reactivateUser)
routerUser.put("/update/:id",verifieToken, updateUser);
routerUser.get("/logout", logout);

routerUser.put("/admin/update/:id", updateUserAdmin);
routerUser.put("/admin/deactivate/:id", adminDeactivateUser);
routerUser.put("/admin/reactivate/:id", adminReactivateUser);

routerAvis.post('/add/:articleId',verifieToken, postAvis)
routerAvis.delete('/delete/:avisId', verifieToken, deleteAvis)
routerAvis.put('/update/:avisId', verifieToken, updateAvis);
