import chalk from "chalk";

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

export function consoleLog(entity: string = 'SERVER', type: string, content: string) {
    const time = () => chalk.gray(`[${new Date().toLocaleTimeString()}]`);
    const colorEntity = colors[entity.toLowerCase()] || chalk.white;
    const colorType = colors[type.toLowerCase()] || chalk.white;

    console.log(time(), colorEntity(`[${entity.toUpperCase()}]`), colorType(`[${type.toUpperCase()}]`), content);
}