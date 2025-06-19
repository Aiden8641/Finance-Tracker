import { financialRequest } from "../@types/request";
import { Row } from "postgres";

export function createUpdateHandler<T>(
  key: keyof financialRequest["body"],
  updateFn: (data: T) => Promise<Row>,
) {
  return async (req: financialRequest, res: any, next: any) => {
    try {
      const data = req.body[key];
      if (!data) {
        return next({ message: `${key.toString()} data missing!` });
      }

      const updatedData = await updateFn(data as T);

      res.json({
        message: `${key.toString()} successfully updated!`,
        updatedData: updatedData,
      });
    } catch (error) {
      return next(error);
    }
  };
}
