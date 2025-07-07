"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.updateUserSchema = exports.verifyEmailSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["USER"] = 1] = "USER";
})(Role || (Role = {}));
exports.createUserSchema = zod_1.z.object({
    body: (0, zod_1.object)({
        name: zod_1.z.string({ required_error: "Name is required" }),
        username: zod_1.z.string({ required_error: "username is required" }),
        email: zod_1.z
            .string({ required_error: "Email address is required" })
            .email("Invalid email address"),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, "Password must be more than 8 characters")
            .max(32, "Password must be less than 32 characters"),
        passwordConfirm: zod_1.z.string({
            required_error: "Please confirm your password",
        }),
        role: zod_1.z.optional(zod_1.z.nativeEnum(Role)),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Password do not match",
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: (0, zod_1.object)({
        email: zod_1.z
            .string({ required_error: "Email address is required" })
            .email("Invalid email address"),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, "Invalid email or password"),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    params: (0, zod_1.object)({
        verificationCode: zod_1.z.string(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    body: (0, zod_1.object)({
        name: zod_1.z.string({}),
        email: zod_1.z.string({}).email("Invalid email address"),
        password: zod_1.z
            .string({})
            .min(8, "Password must be more than 8 characters")
            .max(32, "Password must be less than 32 characters"),
        passwordConfirm: zod_1.z.string({}),
        role: zod_1.z.optional(zod_1.z.nativeEnum(Role)),
    })
        .partial()
        .refine((body) => body.password === body.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Password do not match",
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: (0, zod_1.object)({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Email is invalid"),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        resetToken: zod_1.z.string(),
    }),
    body: zod_1.z
        .object({
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, "Password must be more than 8 characters"),
        passwordConfirm: zod_1.z.string({
            required_error: "Please confirm your password",
        }),
    })
        .refine((data) => data.password === data.passwordConfirm, {
        message: "Password do not match",
        path: ["passwordConfirm"],
    }),
});
//# sourceMappingURL=auth.js.map