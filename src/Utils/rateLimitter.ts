import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const limitter :RateLimitRequestHandler = rateLimit({
    windowMs: 15*60*1000,
    limit: 50,
    message: {
        status: 429,
        message: "Too Many Requests, Try again later"
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});