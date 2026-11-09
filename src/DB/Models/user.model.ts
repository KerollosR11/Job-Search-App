import { HydratedDocument, model, Model, Schema, Types } from "mongoose";
import { GenderEnum, OTPTypeEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum";

export interface IOTP {
    code: string;
    type: OTPTypeEnum;
    expiresAt: Date;
};

export interface IUser {
    _id :Types.ObjectId
    firstName :string
    lastName: string;

    email: string;
    password: string;

    gender: GenderEnum;
    DOB: Date;

    mobileNumber: string;

    role: RoleEnum;
    provider: ProviderEnum;

    isConfirmed: boolean;

    deletedAt?: Date | null;
    bannedAt?: Date | null;

    updatedBy?: Types.ObjectId;

    changeCredentialTime?: Date;

    profilePic?: {
      secure_url: string;
      public_id: string;
    };

    coverPic?: {
      secure_url: string;
      public_id: string;
    };

    OTP: IOTP[];
}

const userSchema = new Schema <IUser>(
    // Attributes
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minLength: 6
        },

        gender: {
            type: String,
            enum: Object.values(GenderEnum),
            required: true
        },

        DOB: {
            type: Date,
            required: true
        },

        mobileNumber: {
            type: String,
            required: true,
            unique: true
        },

        role: {
            type: String,
            enum: Object.values(RoleEnum),
            default: RoleEnum.USER
        },

        provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            default: ProviderEnum.SYSTEM
        },

        isConfirmed: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        },

        bannedAt: {
            type: Date,
            default: null
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        changeCredentialTime: Date,

        profilePic: {
            secure_url: String,
            public_id: String
        },

        coverPic: {
            secure_url: String,
            public_id: String
        },

        OTP: [
            {
                code: String,
                type: {
                    type: String,
                    enum: Object.values(OTPTypeEnum)
                },
                expiresAt: Date
            }
        ]

    },

    // Options
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const UserModel :Model<IUser> = model<IUser>("User", userSchema);
export type HUserDoc = HydratedDocument<IUser>