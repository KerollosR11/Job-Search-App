import { Model, model, Schema, Types } from "mongoose";
import { ApplicationStatusEnum } from "../../Utils/enums/application.enum";


export interface IApplication {
    jobId :Types.ObjectId
    userId :Types.ObjectId
    userCV : {
        secure_url: string;
        public_id: string;
    }
    status :ApplicationStatusEnum 
};

const applicationSchema = new Schema<IApplication>(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userCV: {
            secure_url: String,
            public_id: String
        },
        status: {
            type: String,
            enum: Object.values(ApplicationStatusEnum),
            default: ApplicationStatusEnum.PENDING
        }
    },

    {
        timestamps: true
    }
);

export const ApplicationModel :Model<IApplication> = model<IApplication>("Application", applicationSchema);

