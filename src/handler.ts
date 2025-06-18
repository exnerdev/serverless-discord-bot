import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    InteractionResponseType,
    InteractionType,
    MessageFlags,
    type RESTPostAPIChannelMessageJSONBody,
    type APIInteraction,
    type APIInteractionResponse
} from "discord-api-types/v10";
import commands from "./commands";

class APIResponse extends Response {
    constructor(response?: APIInteractionResponse | null, init?: ResponseInit) {
        super(JSON.stringify(response), {
            ...init,
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        });
    }
}

const botColor = 0x7289da;
const dangerColor = 0xed4245;

export default async function handleCommand(
    interaction: APIInteraction,
    token: string
): Promise<APIResponse> {
    switch (interaction.type) {
        case InteractionType.Ping:
            return new APIResponse({ type: InteractionResponseType.Pong });
        case InteractionType.ApplicationCommand: {
            if (interaction.data.type !== ApplicationCommandType.ChatInput) {
                console.warn("Unknown command type");
                return new APIResponse({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "❌ Unknown command type",
                        flags: MessageFlags.Ephemeral
                    }
                });
            }

            switch (interaction.data.name) {
                case "help": {
                    return new APIResponse({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            embeds: [
                                {
                                    title: "Help Menu",
                                    description: "What juan can do:",
                                    fields: commands.map((command) => ({
                                        name: `/${command.name}`,
                                        value: command.description
                                    })),
                                    color: botColor
                                }
                            ],
                            flags: MessageFlags.Ephemeral
                        }
                    });
                }
                case "echo": {
                    if (!interaction.data.options || interaction.data.options.length === 0) {
                        return new APIResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                embeds: [
                                    {
                                        title: "Error",
                                        description: "❌ No message provided",
                                        color: dangerColor
                                    }
                                ],
                                flags: MessageFlags.Ephemeral
                            }
                        });
                    }

                    const message = interaction.data.options[0];
                    if (message.type !== ApplicationCommandOptionType.String) {
                        return new APIResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                embeds: [
                                    {
                                        title: "Error",
                                        description: "❌ Invalid message type",
                                        color: dangerColor
                                    }
                                ],
                                flags: MessageFlags.Ephemeral
                            }
                        });
                    }

                    const res = await fetch(
                        `https://discord.com/api/v10/channels/${interaction.channel.id}/messages`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bot ${token}`,
                                "Content-Type": "application/json;charset=utf-8"
                            },
                            body: JSON.stringify({
                                content: message.value,
                                message_reference: {
                                    message_id: interaction.id,
                                    fail_if_not_exists: false
                                }
                            } satisfies RESTPostAPIChannelMessageJSONBody)
                        }
                    );

                    if (res.ok) {
                        return new APIResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                embeds: [
                                    {
                                        title: "Done!",
                                        color: botColor
                                    }
                                ],
                                flags: MessageFlags.Ephemeral
                            }
                        });
                    } else {
                        console.error("Failed to send message", await res.text());
                        return new APIResponse({
                            type: InteractionResponseType.ChannelMessageWithSource,
                            data: {
                                embeds: [
                                    {
                                        title: "Error",
                                        description: "❌ Failed to send message",
                                        color: dangerColor
                                    }
                                ],
                                flags: MessageFlags.Ephemeral
                            }
                        });
                    }
                }
                default: {
                    console.warn("Unknown command");
                    return new APIResponse({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            content: "❌ Unknown command",
                            flags: MessageFlags.Ephemeral
                        }
                    });
                }
            }
        }
    }
}
