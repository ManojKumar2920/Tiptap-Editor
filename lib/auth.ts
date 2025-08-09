import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getNativeClient } from "./db";
import { nextCookies } from "better-auth/next-js";
import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'manojkumararumainathan@gmail.com',
        pass: 'qgpd jntl gvef xbrh',
    },
});

// Initialize Better Auth with MongoDB adapter
export const auth = betterAuth({
    database: mongodbAdapter(await getNativeClient()),
    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        async sendVerificationEmail(data) {
            await transporter.sendMail({
                from: '"Editor" <manojkumararumainathan@gmail.com>',
                to: data.user.email,
                subject: "Verify your email",
                html: `
                <h1>Verify Your Email</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${data.url}">Verify Email</a>
                `,
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ["profile", "email"],
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds
        },
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
    },
    plugins: [nextCookies()]
});

