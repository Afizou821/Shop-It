import express from "express";
import { logoutUser ,loginUser, registerUser, forgotPassword, ResetPassword, getUserProfile, updatePassword, updateProfile, getallUser, getUserById, updateUser, deleteUser } from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router= express.Router();
//enregistrement
router.route("/register").post(registerUser);
//login
router.route("/login").post(loginUser);
//logout
router.route("/logout").get(logoutUser);

//forgot
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(ResetPassword);


router.route('/me').get( isAuthenticatedUser ,getUserProfile);
router.route('/me/update').put( isAuthenticatedUser ,updateProfile)
/
//update password
router.route("/password/update").put(isAuthenticatedUser,updatePassword);


//get all user
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("admin"),getallUser);
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRoles("admin"),getUserById);
router.route('/admin/users-update/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateUser);
router.route('/admin/delete-user/:id').delete(isAuthenticatedUser, authorizeRoles("admin"),deleteUser)


export default router; 