import { Model, model, Schema, Types } from "mongoose"
import { JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from "../../Utils/enums/jobs.enum"

export interface IJob {
    jobTitle :string
    jobLocation :JobLocationEnum
    workingTime :WorkingTimeEnum
    seniorityLevel : SeniorityLevelEnum
    jobDescription :string
    technicalSkills :string[]
    softSkills :string[]
    addedBy :Types.ObjectId
    updatedBy :Types.ObjectId
    closed :boolean
    companyId :Types.ObjectId
}

const jobSchema = new Schema<IJob> (
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true
        },
        jobLocation: {
            type: String,
            enum: Object.values(JobLocationEnum),
            required: true
        },
        workingTime: {
            type: String,
            enum: Object.values(WorkingTimeEnum),
            required: true
        },
        seniorityLevel: {
            type: String,
            enum: Object.values(SeniorityLevelEnum),
            required: true
        },
        jobDescription: {
            type: String,
            required: true,
        },
        technicalSkills: {
            type: [String],
            required: true,
        },
        softSkills: {
            type: [String],
            required: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        closed: {
            type: Boolean,
            default: false
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
    }, 

    {
        timestamps: true
    }
);

export const JobModel :Model<IJob> = model<IJob>("Job", jobSchema);

