import { CONFIG } from "../../config";

export abstract class FileHelper {

    public static getUrl(fileName: string): string {

        return `${CONFIG.PUBLIC_ADDRESS}/${CONFIG.FILES_DIR}/${fileName}`;
    }

    public static getFilePath(fileName: string): string {

        return `${CONFIG.FILES_DIR}/${fileName}`;
    }
}