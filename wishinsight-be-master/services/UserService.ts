import { Firestore } from "@google-cloud/firestore";
import {
  Collection,
  UserCollections,
  ItemStatuses,
  ItemTypes,
} from "../enums/enums";
import Dotenv from "dotenv";
import { StatusError } from "../controllers/errors/StatusError";
import { DbUser } from "../models/submitProject/IDbUser";
import * as bcrypt from "bcrypt";
import { DbDemandItem } from "../models/submitProject/IDbDemandItem";
import { WishResponse } from "../models/user/DbWishResponse";
import { DbSellingItem } from "../models/submitProject/IDbSellingItem";
import { SellingResponse } from "../models/user/DbSellingResponse";
Dotenv.config();
const firestore = new Firestore();
const dbEnv = "demand-prod";
/**
 * Create a new project submission from data.
 *
 * @param userInput Input of user
 * @returns ID of the project
 */
export async function userSignUp(userInput: DbUser): Promise<boolean> {
  const { username, zipcode, email, password } = userInput;
  await checkIfUsernameExists(username);
  await checkIfUserEmailExists(email);
  try {
    const userDoc = firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.Users)
      .doc(username);

    const salt = await bcrypt.genSalt(10);

    let genHash: string = "";
    await bcrypt.hash(password, salt).then(function (hash) {
      // Store hash in your password DB.
      genHash = hash;
    });

    const result = {
      username: username,
      password: genHash,
      zipcode,
      email,
      items: [],
      confirmed: true, // TO BE CHANGED TO CONFIRM VIA EMAIL
    };
    const user: DbUser = new DbUser(result);

    await userDoc.set(JSON.parse(JSON.stringify(user)));

    return true;
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "POST /signup - Error sign up");
  }
}

/**
 * Check if user exists.
 *
 * @param username name of the user.
 * @returns True if exists
 */
export async function checkIfUsernameExists(
  username: string
): Promise<boolean> {
  const userDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .get();

  if (userDoc.exists) {
    throw new StatusError(409, "User already exists");
  }
  return false;
}

/**
 * Check if user exists.
 *
 * @param username name of the user.
 * @returns True if exists
 */
export async function checkIfUserEmailExists(email: string): Promise<boolean> {
  const userDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .where("email", "==", email)
    .get();

  if (!userDoc.empty) {
    throw new StatusError(409, "Email already exists");
  }
  return false;
}

/**
 * Add item request to username.
 *
 * @param username name of the user.
 * @param item name of the user.
 * @returns True if exists
 */
export async function addItemRequestToUser(
  username: string,
  item: DbDemandItem
): Promise<boolean> {
  const userDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.Items)
    .doc();

  const userProfileDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .get();
  item.createdBy = username;
  item.status = ItemStatuses.Pending;
  item.urlTitle = item.title.replace(/\s+/g, "-").toLowerCase();
  item.id = userDoc.id;
  item.zipcode = userProfileDoc.data()?.zipcode;

  const user: DbDemandItem = new DbDemandItem(item);

  await userDoc.set(JSON.parse(JSON.stringify(user)));

  return true;
}

/**
 * Add item request to username.
 *
 * @param username name of the user.
 * @param item name of the user.
 * @returns True if exists
 */
export async function addSellingItemRequestToUser(
  username: string,
  item: DbSellingItem
): Promise<boolean> {
  const userDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.SellingItems)
    .doc();

  const userProfileDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .get();
  item.createdBy = username;
  item.status = ItemStatuses.Pending;
  item.urlTitle = item.title.replace(/\s+/g, "-").toLowerCase();
  item.id = userDoc.id;
  item.zipcode = userProfileDoc.data()?.zipcode;

  const user: DbSellingItem = new DbSellingItem(item);

  await userDoc.set(JSON.parse(JSON.stringify(user)));

  return true;
}

/**
 * Get wish items from user.
 *
 * @param username name of the user.
 * @returns List of items
 */
export async function getUserSellingItems(
  username: string
): Promise<SellingResponse[]> {
  const itemsDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.SellingItems)
    .get();

  const response: SellingResponse[] = itemsDoc.docs.map((item: any) => {
    const data = new SellingResponse(item.data());
    return data;
  });

  return response;
}

/**
 * Get wish items from user.
 *
 * @param username name of the user.
 * @returns List of items
 */
export async function getUserWishItems(
  username: string
): Promise<WishResponse[]> {
  const itemsDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.Items)
    .where("type", "==", ItemTypes.Niche)
    .get();

  const response: WishResponse[] = itemsDoc.docs.map((item: any) => {
    const data = new WishResponse(item.data());
    return data;
  });

  return response;
}

/**
 * Get wish items from user.
 *
 * @param username name of the user.
 * @returns List of items
 */
export async function getUserBargainItems(
  username: string
): Promise<WishResponse[]> {
  const itemsDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.Items)
    .where("type", "==", ItemTypes.Bargain)
    .get();

  const response: WishResponse[] = itemsDoc.docs.map((item: any) => {
    const data = new WishResponse(item.data());
    return data;
  });

  return response;
}

/**
 * Delete an item from user.
 *
 * @param userName name of the user.
 * @param itemId id of the item.
 * @returns List of items
 */
export async function deleteItem(
  username: string,
  itemId: string
): Promise<boolean> {
  const itemsDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .collection(UserCollections.SellingItems)
    .doc(itemId);

  await itemsDoc.delete();
  return true;
}

/**
 * Get all item names.
 *
 * @returns List of items
 */
export async function getAllItemNames(): Promise<string[]> {
  const itemsRef = await firestore.collectionGroup(UserCollections.Items).get();

  const result = itemsRef.docs.map((item: any) => {
    return item.data()?.title;
  });

  return [...new Set(result)];
}
