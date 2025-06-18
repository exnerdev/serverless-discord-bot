import { config } from "dotenv";
import { resolve } from "node:path";
import { cwd, env } from "node:process";
import { request } from "node:https";
import commands from "./commands";

config({
    path: resolve(cwd(), ".dev.vars")
});

const applicationId = env.applicationId;
const token = env.token;

if (!applicationId || applicationId.trim().length === 0) {
    throw new Error("The applicationId environment variable is not set.");
}
if (!token || token.trim().length === 0) {
    throw new Error("The token environment variable is not set.");
}

const commandsToString = JSON.stringify(commands);

const req = request(
    `https://discord.com/api/v10/applications/${applicationId}/commands`,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Length": Buffer.byteLength(commandsToString),
            Authorization: `Bot ${token}`
        }
    },
    (res) => {
        let error = "";
        res.on("data", (chunk) => {
            error += chunk;
        });

        res.on("end", () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                console.log("Successfully registered application commands");
            } else {
                throw new Error(
                    `Failed to register application commands!\nStatus Code: '${res.statusCode}'\n${error}`
                );
            }
        });
    }
);

req.write(commandsToString);
req.end();
