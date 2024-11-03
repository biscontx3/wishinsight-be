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
import { DbChatMessage } from "../models/chat/chatPost";
Dotenv.config();
const firestore = new Firestore();
const dbEnv = "demand-prod";

/**
 * Create chat message.
 *
 * @param messageInput Input of message
 * @returns ID of the project
 */
export async function PostChatMessage(
  messageInput: DbChatMessage
): Promise<boolean> {
  const { from, message, to } = messageInput;
  try {
    const roomName = `chat_${from}_${to}`;

    const roomDoc = firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .doc(roomName);

    const roomData = {
      from,
      to,
    };

    await roomDoc.set(JSON.parse(JSON.stringify(roomData)));

    const chatDoc = firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .doc(roomName)
      .collection(Collection.ChatMessages)
      .doc();

    const data = {
      message,
      from,
      to,
      id: chatDoc.id,
      created: 0,
      seen: false,
    };

    const result = new DbChatMessage(data);

    await chatDoc.set(JSON.parse(JSON.stringify(result)));

    return true;
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "POST /chat - Error posting chat");
  }
}

/**
 * Get chat participants.
 *
 * @param username username of the signed in user
 * @returns string of usernames
 */
export async function GetUserChatParticipants(
  username: string
): Promise<string[]> {
  try {
    const fromCol = await firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .where("from", "==", username)
      .get();

    const toCol = await firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .where("to", "==", username)
      .get();

    const fromNames = fromCol.docs.map((item) => item.data().to);
    const toNames = toCol.docs.map((item) => item.data().from);
    const mergedArr = fromNames.concat(toNames);

    return [...new Set(mergedArr)];
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "GET /chat - Error getting chat participants");
  }
}

/**
 * Get chat history.
 *
 * @param username username of the signed in user
 * @param participantName name of participant
 * @returns string of usernames
 */
export async function GetUserParticipantChatHistory(
  username: string,
  participantName: string
): Promise<any> {
  try {
    const roomFromName = `chat_${username}_${participantName}`;
    let fromCol = await firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .doc(roomFromName)
      .collection(Collection.ChatMessages)
      .get();

    const roomToName = `chat_${participantName}_${username}`;
    const toCol = await firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .doc(roomToName)
      .collection(Collection.ChatMessages)
      .get();

    const fromRes = fromCol.docs.map((fromItem) => {
      const data = fromItem.data();
      return data;
    });

    const toRes = toCol.docs.map((toItem) => {
      const data = toItem.data();
      return data;
    });

    const result = fromRes.concat(toRes);
    return result;
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "GET /chat - Error getting chat participants");
  }
}

/**
 * Set messages as seen.
 *
 * @param username username of the signed in user
 * @param participantName name of participant
 *
 */
export async function SetUserMessageSeen(
  username: string,
  participantName: string
) {
  try {
    const roomToName = `chat_${participantName}_${username}`;
    const toCol = await firestore
      .collection(dbEnv)
      .doc(Collection.Metadata)
      .collection(Collection.ChatRooms)
      .doc(roomToName)
      .collection(Collection.ChatMessages)
      .get();

    await Promise.all(
      toCol.docs.map(async (item) => {
        await item.ref.update({ seen: true });
      })
    );
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "GET /chat - Error getting chat participants");
  }
}

/**
 * Set messages as seen.
 *
 * @param username username of the signed in user
 * @param participantName name of participant
 *
 */
export async function GetChatNotifications(
  username: string
): Promise<string[]> {
  try {
    const unseenMessages = await firestore
      .collectionGroup(Collection.ChatMessages)
      .where("seen", "==", false)
      .where("to", "==", username)
      .get();

    return unseenMessages.docs.map((item) => item.data().from);
  } catch (error) {
    console.log(error);
    throw new StatusError(500, "GET /chat - Error getting chat participants");
  }
}
