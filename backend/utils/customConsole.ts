import chalk from "chalk";

type entityType = Uppercase<"server" | "db" | "socket"> | Lowercase<"server" | "db" | "socket">
type logType = Uppercase<"auth" | "info" | "warn" | "error" | "debug"> | Lowercase<"auth" | "info" | "warn" | "error" | "debug">

const colors = {
    server: chalk.blue,
    db: chalk.magenta,
    socket: chalk.cyan,
    auth: chalk.yellow,
    info: chalk.green,
    warn: chalk.hex('#FFD700'),
    error: chalk.redBright,
    debug: chalk.gray,
};

export function consoleLog(entity: entityType, type: logType, content: string) {
    const colorEntity = colors[entity.toLowerCase()] || chalk.white;
    const colorType = colors[type.toLowerCase()] || chalk.white;
    const time = () => chalk.gray(`[${new Date().toLocaleTimeString()}]`);

    console.log(time(), colorEntity(`[${entity.toUpperCase()}]`), colorType(`[${type.toUpperCase()}]`), content);
}