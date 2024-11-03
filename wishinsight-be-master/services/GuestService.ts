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
import { GuestItem } from "../models/guest/DbGuestItem";
Dotenv.config();
const firestore = new Firestore();
const dbEnv = "demand-prod";

/**
 * Get all items.
 *
 * @returns List of items
 */
export async function getAllItems(): Promise<any> {
  const itemsRef = await firestore.collectionGroup(UserCollections.Items).get();

  const result = itemsRef.docs.map((item: any) => {
    const data = new GuestItem(item.data());
    return data;
  });

  return processObjects(result);
}

/**
 * Get users with the item
 *
 * @returns List of usernames
 */
export async function getUsersWithItems(item: string): Promise<any[]> {
  const queryLower = item.toLowerCase();
  const itemsRef = await firestore
    .collectionGroup(UserCollections.Items)
    .where("title", "==", queryLower)
    .where("status", "==", "pending")
    .get();

  const result = itemsRef.docs.map((item: any) => {
    const data = item.data();
    const userObj = {
      createdBy: data.createdBy,
      price: data.price,
      description: data.description,
      amount: data.amount,
      recurrence: data.recurring,
    };
    return userObj;
  });

  return [...new Set(result)];
}

function processObjects(objects: GuestItem[]) {
  const titleMap: Record<string, { prices: number[]; users: Set<string> }> = {}; // Map to store titles and their corresponding prices and users
  const userItemsMap: Record<string, Set<string>> = {}; // Map to store unique items for each user

  // Iterate through each object in the list
  const pays = calculateEarnings(objects);

  objects.forEach((obj) => {
    const { title, createdBy, amount, price, recurring } = obj;

    // If the title doesn't exist in the titleMap, initialize it with an empty array and empty set
    if (!titleMap[title]) {
      titleMap[title] = { prices: [], users: new Set() };
    }

    // If the createdBy doesn't exist in the userItemsMap, initialize it with an empty Set
    if (!userItemsMap[createdBy]) {
      userItemsMap[createdBy] = new Set();
    }

    // Push the price to the array corresponding to the title
    titleMap[title].prices.push(price);
    // Add the createdBy to the Set corresponding to the title
    titleMap[title].users.add(createdBy);
    // Add the title to the Set corresponding to the createdBy
    userItemsMap[createdBy].add(title);
  });

  // Calculate the average price for each title
  const titleAverages: Record<string, string> = {};
  for (const title in titleMap) {
    const { prices } = titleMap[title];
    const averagePrice = (
      prices.reduce((acc, curr) => acc + curr, 0) / prices.length
    ).toFixed(2);
    titleAverages[title] = averagePrice;
  }

  // Convert Set to Array for each user and count the number of unique items
  const formattedUserItemsMap: Record<
    string,
    { items: string[]; count: number }
  > = {};
  for (const createdBy in userItemsMap) {
    const itemsArray = Array.from(userItemsMap[createdBy]);
    formattedUserItemsMap[createdBy] = {
      items: itemsArray,
      count: itemsArray.length,
    };
  }

  // Calculate the count of users who have each item
  const itemCounts: Record<string, number> = {};
  for (const title in titleMap) {
    const userCount = titleMap[title].users.size;
    itemCounts[title] = userCount;
  }
  const sortedItemCounts = Object.entries(itemCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Construct the result object
  const result: Record<string, any> = {
    list: titleAverages,
    itemCounts: {},
    pays,
  };
  sortedItemCounts.forEach(([title, count]) => {
    result.itemCounts[title] = count;
  });

  // Return the object containing title averages, unique items for each user, and counts of users for each item
  return result;
}

function calculateEarnings(items: any) {
  // Helper function to calculate yearly willing to pay based on recurring period
  const calculateYearlyWillingToPay = (
    amount: number,
    price: number,
    recurring: string
  ) => {
    let willingToPay = price;

    switch (recurring) {
      case "day":
        return willingToPay * 365;
      case "week":
        return (willingToPay *= 52);
      case "month":
        return (willingToPay *= 12);
      case "year":
        return willingToPay;
      case "decade":
        return (willingToPay /= 10);

      default:
        // Handle non-recurring or unknown recurring values
        return willingToPay;
    }
  };

  // Calculate yearly potential earnings for each item
  const earningsByTitle = items.reduce((acc: any, item: any) => {
    const yearlyWillingToPay = calculateYearlyWillingToPay(
      item.amount,
      item.price,
      item.recurring
    );
    const title = item.title;

    // If the title already exists, add to its total, otherwise initialize it
    if (acc[title]) {
      acc[title] += yearlyWillingToPay;
    } else {
      acc[title] = yearlyWillingToPay;
    }

    return acc;
  }, {});

  // Convert yearly earnings to monthly earnings for each title
  const monthlyEarningsByTitle: any = {};
  for (const title in earningsByTitle) {
    monthlyEarningsByTitle[title] = earningsByTitle[title] / 12;
  }

  return {
    yearlyEarningsByTitle: earningsByTitle,
    monthlyEarningsByTitle: monthlyEarningsByTitle,
  };
}
