const User = require("../models/User");
const { supabase } = require("../config/supabaseClient");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "3d",
  });
};

// create an user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // verify if user exist
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ errors: ["Usuário já encontrado."] });
    }

    // security password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: passwordHash });
    await newUser.save();

    // return user with token
    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: ["Não foi possível criar o usuário."] });
  }
};

// get current user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exist
    if (!user) {
      return res.status(404).json({ errors: ["O usuário não existe."] });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // check if password match
    if (!isPasswordCorrect) {
      return res.status(401).json({ errors: ["Senha inválida."] });
    }

    // return user with token
    res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
  }
};

// update an user
const update = async (req, res) => {
  try {
    const { name, password, bio } = req.body;
    const profileImage = req.file ? req.file : null;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      // password hash
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    if (bio) {
      user.bio = bio;
    }

    if (profileImage) {
      const file = profileImage;

      // set file name
      const fileName = `${Date.now()}-${file.originalname}`;

      // make upload in supabase
      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(`users/${fileName}`, file.buffer);
      user.userProfile = profileImage;

      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ errors: ["Erro ao fazer upload da imagem no Supabase."] });
      }

      // save image name
      user.userProfile = fileName;
    }

    await user.save();

    const updatedUser = await User.findById(reqUser._id).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao atualizar usuário."] });
  }
};

// get an user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    // verify if user exists
    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  update,
  getUserById,
};
