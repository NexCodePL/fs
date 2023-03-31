import { extname, dirname } from "path";
import { mkdir as mkdirRaw, access, writeFile as writeFileRaw, readFile as readFileRaw } from "fs/promises";
import { constants } from "fs";

export async function mkdir(path: string): Promise<void> {
    if (!path) throw new Error("Empty dir passed to mkdirSafe");

    const directory = extname(path) === "" ? path : dirname(path);

    if (await exists(directory)) return;

    await mkdirRaw(directory, { recursive: true });
}

export async function exists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

export async function writeFile(path: string, content: string) {
    await mkdir(path);
    return writeFileRaw(path, content);
}

export async function readFileJSON<T>(path: string): Promise<T | undefined> {
    try {
        const file = await readFile(path);

        if (!file) return undefined;

        return JSON.parse(file) as T;
    } catch (e) {
        return undefined;
    }
}

export async function readFile(path: string): Promise<string | undefined> {
    try {
        if (!(await exists(path))) return undefined;
        return (await readFileRaw(path)).toString();
    } catch (e) {
        return undefined;
    }
}
