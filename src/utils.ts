import * as fs from 'fs/promises';
import { parse } from 'yaml'
import * as path from 'path';

// 读取 YAML 文件
export async function readYamlFile(filePath: string) {
    try {
        // 读取文件内容
        const fileContent = await fs.readFile(filePath, 'utf8');
        // 解析 YAML 数据
        return parse(fileContent);
    } catch (error: any) {
        console.error(`Error reading YAML file: ${error}`);
        return null;
    }
}


export async function* iterateFilesInFolder(folderPath: string): AsyncGenerator<string> {
    try {
        // 读取文件夹内容
        const files = await fs.readdir(folderPath);

        // 遍历文件
        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // 检查是否为文件夹
            const isDirectory = (await fs.stat(filePath)).isDirectory();

            if (isDirectory) {
                // 如果是文件夹，则递归遍历
                yield* iterateFilesInFolder(filePath);
            } else {
                // 如果是文件，则返回文件路径
                yield filePath;
            }
        }
    } catch (error: any) {
        console.error(`Error iterating files: ${error}`);
    }
}

export async function PromisePoolAll<T>(
    iter: AsyncIterable<T> | Iterable<T>,
    producer: (input: T) => void,
    concurrencyNum: number = 3) {
    const worker = async (
        iterator: AsyncIterable<T> | Iterable<T>,
        workerIndex: number
    ) => {
        for await (const input of iterator) {
            // console.log(`worker${workerIndex} do job ${index + 1}/${taskNum}`);
            await producer(input);
        }
    };
    const threads = Array(concurrencyNum)
        .fill(iter)
        .map(worker);
    await Promise.allSettled(threads);
}


export function removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex !== -1) {
        // 如果存在点（.），则截取点之前的部分
        return fileName.slice(0, lastDotIndex);
    } else {
        // 如果不存在点，则返回原始文件名
        return fileName;
    }
}