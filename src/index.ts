import { verifyKey } from "discord-interactions";
import handleCommand from "./handler";

export default {
    async fetch(request, env, ctx): Promise<Response> {
        if (request.method !== "POST") {
            console.warn("Method is not POST");

            return new Response(null, {
                status: 405
            });
        }

        const signature = request.headers.get("x-signature-ed25519");
        const timestamp = request.headers.get("x-signature-timestamp");
        const body = await request.clone().arrayBuffer();

        if (!signature || !timestamp) {
            console.warn("Missing signature or timestamp");
            return new Response(null, { status: 401 });
        }

        const isValidRequest = await verifyKey(body, signature, timestamp, env.discordPublicKey);

        if (!isValidRequest) {
            console.warn("Invalid request signature");
            return new Response(null, { status: 401 });
        }

        return await handleCommand(await request.json(), env.token);
    }
} satisfies ExportedHandler<Env>;
