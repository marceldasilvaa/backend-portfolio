const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O minímo de caracteres é 3."),
    body("email")
      .isString()
      .withMessage("O e-mail deve ser é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido.")
      .isLength({ min: 4 })
      .withMessage("O minímo de caracteres é 4."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha deve possuir no minímo 6 caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação da senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage(
        "A confirmação de senha deve possuir no minímo 6 caracteres."
      )
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas precisam ser iguais.");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail deve ser é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido.")
      .isLength({ min: 4 })
      .withMessage("O minímo de caracteres é 4."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha deve possuir no minímo 6 caracteres."),
  ];
};

const updateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O minímo de caracteres é 3."),
    body("password")
      .isString()
      .optional()
      .withMessage("A senha deve possuir no minímo 6 caracteres."),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  updateValidation,
};
