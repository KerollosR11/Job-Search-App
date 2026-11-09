import  { model, Model, Schema, Types } from "mongoose";

export interface ICompany {
    companyName :string
    description :string
    industry :string
    address :string
    numberOfEmployees :number
    companyEmail :string
    createdBy :Types.ObjectId
    logo ? :{
        secure_url :string;
        public_id :string;
    };
    coverPic ?:{
        secure_url :string;
        public_id :string;
    }
    HRs :Types.ObjectId[]
    bannedAt :Date | null
    deletedAt :Date | null

    legalAttachment?: {
        secure_url: string;
        public_id: string;
    };
    
    approvedByAdmin :boolean
}

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        industry: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        numberOfEmployees: {
            type: Number,
            required: true,
            min: 11,
            max: 20
        },

        companyEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        logo: {
            secure_url: String,
            public_id: String
        },

        coverPic: {
            secure_url: String,
            public_id: String
        },

        HRs: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        bannedAt: {
            type: Date,
            default: null
        },

        deletedAt: {
            type: Date,
            default: null
        },

        legalAttachment: {
            secure_url: String,
            public_id: String
        },

        approvedByAdmin: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

export const CompanyModel :Model<ICompany> = model<ICompany>("Company", companySchema);

