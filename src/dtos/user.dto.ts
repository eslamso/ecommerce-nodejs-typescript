import { changeUserPassword } from "../services/user.services";

export interface createUserBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImg?: string;
  phoneNumber?: string;
  isActivated?: boolean;
}

export interface getAllUserQuery {
  name?: string;
  email?: string;
  active?: boolean;
  role?: string;
  phoneNumber?: string;
  isActivated?: boolean;
}

export interface changeUserPasswordBody {
  password: string;
}

export interface changeMyPasswordBody {
  oldPassword: string;
  newPassword: string;
  newConfirmPassword: string;
}

export interface updateMeBody {
  name?: string;
  phoneNumber?: string;
  email?: string;
  profileImg?: string;
}

export type myFavoritesProductParams = {
  productId: string;
};

export interface addMyAddressBody {
  alias: string;
  details?: string;
  city: string;
  postalCode?: string;
}

export type MyAddressParams = {
  id: string;
};
