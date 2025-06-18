import {
    ApplicationCommandOptionType,
    type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10";

export default [
    {
        name: "help",
        description: "List of commands"
    },
    {
        name: "echo",
        description: "Replies with the same message you send",
        options: [
            {
                name: "message",
                description: "The message to echo",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
] satisfies RESTPostAPIApplicationCommandsJSONBody[];
