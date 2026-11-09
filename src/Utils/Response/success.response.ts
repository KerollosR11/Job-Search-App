import { Response } from "express";

// export const SuccessResponse = <T> (res :Response, statusCode :number = 200, message :string = "Success", data? :T )=>{
//     return res.status(statusCode).json({
//         message,
//         data
//     });
// }


interface ISuccessResponse<T = unknown> {
  res: Response;
  message?: string;
  statusCode?: number;
  data?: T;
}

export const SuccessResponse = <T = unknown>({
  res,
  message = "Done",
  statusCode = 200,
  data
}: ISuccessResponse<T>) => {
  return res.status(statusCode).json({
    message,
    data
  });
};