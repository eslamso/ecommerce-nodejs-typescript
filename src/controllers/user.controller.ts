import express from "express";
import {
  addMyAddress,
  addProductToMyFavorites,
  changeMyPassword,
  changeUserPassword,
  createUser,
  deleteUser,
  getAllUsers,
  getMe,
  getMyAddresses,
  getUser,
  removeMyAddress,
  removeProductToMyFavorites,
  resizeUserImage,
  updateMe,
  updateMyAddress,
  updateUser,
  uploadUserImage,
} from "../services/user.services";
import { protect, restrictTo } from "../services/auth.services";
import {
  addMyAddressValidator,
  addProductToMyFavoritesValidator,
  changeMyPasswordValidator,
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  myAddressValidator,
  updateMeValidator,
  updateUserValidator,
} from "../middlewares/validators/user.validator";
const userRouter = express.Router();
userRouter.get("/myAddresses", protect, getMyAddresses);
userRouter.post("/addMyAddress", protect, addMyAddressValidator, addMyAddress);

userRouter.put(
  "/updateMyAddress/:id",
  protect,
  myAddressValidator,
  updateMyAddress
);

userRouter.delete(
  "/deleteMyAddress/:id",
  protect,
  myAddressValidator,
  removeMyAddress
);

userRouter
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    uploadUserImage,
    createUserValidator,
    resizeUserImage,
    createUser
  )
  .get(protect, getAllUsers);
userRouter.put(
  "/:id",
  protect,
  restrictTo("admin"),
  uploadUserImage,
  updateUserValidator,
  resizeUserImage,
  updateUser
);

userRouter.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  deleteUserValidator,
  deleteUser
);
userRouter.get("/me", protect, getMe);
userRouter.get("/:id", protect, getUser);
userRouter.put(
  "/changePassword/:id",
  protect,
  restrictTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);
userRouter.patch(
  "/changeMyPassword",
  protect,
  changeMyPasswordValidator,
  changeMyPassword
);
userRouter.patch(
  "/updateMe",
  protect,
  uploadUserImage,
  updateMeValidator,
  resizeUserImage,
  updateMe
);

userRouter.post(
  "/addProductToMyFav/:productId",
  protect,
  addProductToMyFavoritesValidator,
  addProductToMyFavorites
);
userRouter.post(
  "/removeProductToMyFav/:productId",
  protect,
  addProductToMyFavoritesValidator,
  removeProductToMyFavorites
);

export default userRouter;
