const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash } = require("bcryptjs");

class UsersController {

  async create(request, response) {
    const { name, email, password, admin = false } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, admin]
    );

    return response.status(201).json();
  }

}

module.exports = UsersController;
