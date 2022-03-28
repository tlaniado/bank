const { Account } = require("../mongo/account-model");
const { hash, compare } = require("bcrypt");
const router = require("express").Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AccoountBody:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: name of the account owner
 *         password:
 *           type: string
 *           descripton: choose password to securly log into your account
 *       example:
 *         username: jo
 *         password: "123"
 *
 */
/**
 * @openapi
 * /api/account/register:
 *   post:
 *     description: log to your account.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccoountBody'
 *     responses:
 *       200:
 *         description: welcome to your account.
 *       400:
 *         description: missing info in the request body.
 *       401:
 *         description: wrong password.
 */

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    const userToBeSaved = new Accounts({ username, password: hashedPassword });
    await userToBeSaved.save();
    res.status(201).send({ msg: "user added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400);
    if (error.code === 11000) {
      res.send({ err: "username already taken" });
    } else {
      res.send({ err: error });
    }
  }
});

/**
 * @openapi
 * /api/account/login:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccoountBody'
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send({ err: "misiing some info..." });
  }
  try {
    const account =  await Account.findOne({ username })

    if (!account) {
      return res.status(400).send({ err: "user not find" });
    }

    if (!(await compare(password, account.password))) {
      return res.status(400).send({ err: "wrong password" });
    }

    req.session.account = { username, id: account._id };
    res.send({ msg: "logged successfully, welcome " + username });
  } catch (err) {
      console.log(err)
    res.status(400).send({ err: err });
  }
});

/**
 * @openapi
 * /api/account/logout:
 *   delete:
 *     description: logout of from your account ByBy😘!
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.delete("/logout", (req, res) => {
  const name = req.session.account.username
  req.session.destroy()
  res.send({ msg: "bye bye " + name })
})
 
module.exports = router  