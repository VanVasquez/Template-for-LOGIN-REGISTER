/**
 * *Create account already in auth.controller.js, here in user,
 * *all controls for user is found here. Edit account, Delete account, View account / View All account
 */

const userController = {
  editAccount: (req, res) => {
    res.send("edit");
  },
  deleteAccount: (req, res) => {
    res.send("delete");
  },
  viewAccount: (req, res) => {
    res.send("view");
  },
  viewAllAccount: (req, res) => {
    res.send("viewAll");
  },
};

module.exports = userController;
