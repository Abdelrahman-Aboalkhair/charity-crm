import cookieParser from "cookie-parser";

export const cookieParserOptions: cookieParser.CookieParseOptions = {};

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
  domain: "localhost",
};
