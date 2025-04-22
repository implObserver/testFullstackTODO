import { apiRouter } from "../../../../routes/api/api.js";
import { indexRouter } from "../../../../routes/index.js";
import { app } from "../../../app.js";

export const useRoutes = () => {
  app.use(indexRouter);
  app.use(apiRouter);
};
