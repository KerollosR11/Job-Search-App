import { model, Model, Schema } from "mongoose";
import { Types } from "mongoose";

interface IMessage {
  message: string;
  senderId: Types.ObjectId;
}

export interface IChat {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  messages: IMessage[];
}


const chatSchema = new Schema<IChat>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    messages: [
      {
        message: {
          type: String,
          required: true
        },

        senderId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const ChatModel :Model<IChat> = model<IChat>("Chat", chatSchema);
