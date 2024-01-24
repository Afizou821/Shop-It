import express from "express";
import {deleteProduct,updateProduct, getProductDetails, getProducts, newProduct, createProductReview, getAllReview, deleteProductReview } from "../controllers/productControlles.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router= express.Router();
//afficher les produits
router.route("/products").get(getProducts);

//ajouter un prduits
router.route("/admin/products").post(isAuthenticatedUser,authorizeRoles("admin"),newProduct);

//chercher un prodit
router.route("/products/:id").get(getProductDetails);
//modifier un produit
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
//supprimer un produit
router.route("/admin/products/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

//commenter  un produit
router.route("/reviews").put(isAuthenticatedUser,createProductReview);
router.route("/getAllReviews/:id").get(isAuthenticatedUser, getAllReview);

router.route("/admin/reviews").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProductReview);

export default router;