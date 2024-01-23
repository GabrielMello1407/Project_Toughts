const User = require('../models/User')

const bycript = require('bcryptjs')

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login')
  }

  static register(req, res) {
    res.render('auth/register')
  }
  static async registerPost(req, res) {
    const {
      name,
      email,
      password,
      confirmpassword
    } = req.body

    // password match validation
    if (password != confirmpassword) {
      // menssage to front
      req.flash('message', 'As senhas não conferem, tente novamente!')
      res.render('auth/register')
      return
    }

    // check if user exist

    const checkIfUserExist = await User.findOne({
      where: {
        email: email
      }
    })

    if (checkIfUserExist) {
      req.flash('message', 'O e-mail ja está em uso!')
      res.render('auth/register')
      return
    }

    // create a password
    const salt = bycript.genSaltSync(10)

    const hashedPassword = bycript.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {

      await User.create(user)

      req.flash('message', 'Cadastro realizado com sucesso!')

      res.redirect('/')
    } catch (err) {
      console.log(err)
    }


  }
}