import { asyncDownload, asyncRequest } from '@/utils/AsyncAPI';
import { isString } from '@/utils/TypeTools/TypesTools';

export interface FileInfo {
    tempPath?: string
    length: number
    lastModified?: Date
    type?: string
    etag?: string
}

const fileMap = new Map<string, FileInfo>();

/**
 * 对比文件是否相同
 * @param files
 */
export function isSameFile(...files: FileInfo[]): boolean {
    if (Array.isArray(files)) {
        if (files.length < 2) {
            return true;
        } else {
            const firstFile = files[0];
            const tailFile = files.slice(1);

            return tailFile.every((item) => {
                return item.length === firstFile.length
                    && item.etag === firstFile.etag
                    && item.type === firstFile.type
                    && item.lastModified?.getTime() === firstFile.lastModified?.getTime();
            });
        }
    } else {
        return false;
    }
}

export async function queryFileInfo(url: string): Promise<FileInfo> {
    const { header } = await asyncRequest({
        url,
        method: 'HEAD',
        cache: 'no-cache',
    });

    const info: FileInfo = {
        length: 0,
    };

    Object.keys(header).forEach((key) => {
        const value = header[key];
        switch (key.toLowerCase()) {
            case 'content-type':
                info.type = value;
                break;
            case 'content-length':
                info.length = Number(value);
                break;
            case 'last-modified':
                info.lastModified = new Date(value);
                break;
            case 'etag':
                info.etag = value;
                break;
        }
    });

    return info;
}

export async function downloadFile(url: string): Promise<string> {
    const newInfo = await queryFileInfo(url);

    if (fileMap.has(url)) { // 缓存池中如果有，且文件没有发生变化，则直接返回
        const oldInfo = fileMap.get(url)!;
        if (isSameFile(oldInfo, newInfo)) return oldInfo.tempPath!;
    }

    const { tempFilePath, statusCode } = await asyncDownload({ url });

    if (statusCode !== 200 || !isString(tempFilePath) || tempFilePath.length === 0)
        throw new Error('fail to download file');

    newInfo.tempPath = tempFilePath;
    fileMap.set(url, newInfo);

    return tempFilePath;
}
