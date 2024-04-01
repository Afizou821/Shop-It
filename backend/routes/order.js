import express  from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { allOrders, deleteOrders, getOrderDetails, getSales, myOrders, newOrder, updateOrders } from "../controllers/orderControllers.js";

const router=express.Router();

router.route("/orders/new").post(isAuthenticatedUser,newOrder);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin") , allOrders);
router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizeRoles("admin") , updateOrders);
router.route("/admin/orders/:id").delete(isAuthenticatedUser,authorizeRoles("admin") , deleteOrders);
router.route("/admin/get_sales").get(isAuthenticatedUser,authorizeRoles("admin") , getSales);
console.log("hi dans routes");

export default router