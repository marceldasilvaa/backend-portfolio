const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("O título é obrigatório.")
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter pelo menos 3 caracteres."),
    body("description")
      .not()
      .equals("undefined")
      .withMessage("A descrição é obrigatória.")
      .isString()
      .withMessage("A descrição é obrigatória.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter pelo menos 10 caracteres."),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória.");
      }

      return true;
    }),
    body("link")
      .not()
      .isEmpty()
      .withMessage("O link é obrigatório.")
      .isURL()
      .withMessage("O link deve ser uma URL válida."),
  ];
};

const photoUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .isString()
      .withMessage("O título é obrigatório.")
      .isLength({ min: 4 })
      .withMessage("O título precisa ter no mínimo 4 caracteres."),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição é obrigatória.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter pelo menos 10 caracteres."),
  ];
};

const photoCommentValidation = () => {
  return [
    body("comment")
      .isString()
      .withMessage("O comentário é obrigatório")
      .isLength({ min: 1 })
      .withMessage("O comentário deve ter pelo menos um caractere."),
  ];
};

module.exports = {
  photoInsertValidation,
  photoUpdateValidation,
  photoCommentValidation,
};
