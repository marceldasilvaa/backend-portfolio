const Photo = require("../models/Photo");
const User = require("../models/User");
const { supabase } = require("../config/supabaseClient");

// insert a photo
const insertPhoto = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  const userReq = req.user;
  const user = await User.findById(userReq._id);

  if (!file) {
    return res.status(400).json({ errors: ["Nenhuma imagem foi enviada."] });
  }

  // unique name for file
  const fileName = `${Date.now()}-${file.originalname}`;

  // upload to supabase
  const { data, error } = await supabase.storage
    .from("portfolio")
    .upload(`photos/${fileName}`, file.buffer, { contentType: file.mimetype });

  if (error) {
    console.error(error);
    return res
      .status(500)
      .json({ errors: ["Erro ao fazer upload da imagem."] });
  }

  // get the public URL
  const { data: publicUrlData } = supabase.storage
    .from("portfolio")
    .getPublicUrl(`photos/${fileName}`);

  const baseUrl = "https://myhyuthmduqbjjvlibdc.supabase.co"
  const fullPublicUrl = baseUrl + publicUrlData.pulicUrl;

  const newPhoto = await Photo.create({
    title,
    description,
    image: fullPublicUrl,
    userId: user._id,
    userName: user.name,
  });

  if (!newPhoto) {
    return res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
    });
  }

  res.status(201).json(newPhoto);
};

// remove a photo
const removePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    // verify if user exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    // check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      return res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    await Photo.findByIdAndDelete(photo._id);
    res
      .status(200)
      .json({ id: photo._id, message: "Projeto excluído com sucesso." });
  } catch (error) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};

// get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  // verify if photos exists
  if (!photos) {
    return res.status(404).json({ errors: ["Ainda não existem fotos."] });
  }

  res.status(200).json(photos);
};

// get photos from user
const getPhotosUser = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

// get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);

  // verify if photo was removed
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }

  res.status(200).json(photo);
};

// update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const photo = await Photo.findById(id);

  // verify if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }

  if (title) {
    photo.title = title;
  }

  if (description) {
    photo.description = description;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// like functionality
const likePhoto = async (req, res) => {
  const reqUser = req.user;
  const { id } = req.params;

  const photo = await Photo.findById(id);

  // check if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }

  // check if user already like the photo
  if (photo.likes.includes(reqUser._id)) {
    return res.status(422).json({ errors: ["Você já curtiu a foto."] });
  }

  // put user id in likes array
  photo.likes.push(reqUser._id);

  photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
};

// comment functionality
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  const user = await User.findById(reqUser._id);

  // verify if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }

  const userComment = {
    comment,
    userId: user._id,
    userImage: user.userProfile,
    userName: user.name,
  };

  // put user comment in array
  photo.comments.push(userComment);

  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: "Comentário adicionado com sucesso!",
  });
};

// search photos by title
const searchPhoto = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  removePhoto,
  getAllPhotos,
  getPhotosUser,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto,
};
