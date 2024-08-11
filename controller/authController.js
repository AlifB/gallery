require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.index = (req, res) => {
  res.render("loginView", { loggedIn: req.cookies.token ? true : false });
};

exports.auth = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      try {
        const token = jwt.sign(
          { username: process.env.ADMIN_USERNAME },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return res.redirect("/admin");
      } catch (error) {
        console.error("Error creating JWT:", error);
        return res.status(500).send("Error creating JWT");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).send("Error authenticating user");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.redirect("/login");
};
