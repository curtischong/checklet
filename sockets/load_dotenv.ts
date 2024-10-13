import dotenv from "dotenv";
import path from "path";

// we are putting the dotenv loading script in a separate file so it's loaded BEFORE everything else is imported (e.g. reading mixpanel key from the env) https://stackoverflow.com/questions/77853644/how-to-load-env-file-data-before-imports
// we need this as early as possible so dependencies can use it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dotenv_loaded = dotenv.config({
  path: [path.resolve(__dirname, ".env"), path.resolve(__dirname, "../.env")],
});
// console.log("dotenvLoad", dotenv_loaded);
export default true;
