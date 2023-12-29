import { UnityAssetDB } from "./db";
import { PromisePoolAll, iterateFilesInFolder, readYamlFile, removeFileExtension } from "./utils";


// const RootPath = "E:\\unity_2.4\\HK4E\\"

async function ScanFolder(rootPath: string, db: UnityAssetDB) {
    const asyncIterable = {
        [Symbol.asyncIterator]: () => iterateFilesInFolder(rootPath)
    };

    await PromisePoolAll(asyncIterable, async (metaFilePath: string) => {
        if (!metaFilePath.endsWith(".meta")) return;
        console.log(metaFilePath);

        const yamlFile = await readYamlFile(metaFilePath);
        if (yamlFile?.guid) {
            const filePath = removeFileExtension(metaFilePath);
            const relatePath = filePath.replace(rootPath, "");

            const fileContent = await readYamlFile(filePath);
            if (fileContent) {

            }
            await db.AddAssetFile(yamlFile.guid, relatePath, []);
        }
    });
}




async function main() {
    const db = new UnityAssetDB();
    // 
    // await ScanFolder("E:\\unity_2.4\\HK4E\\Assets", db);
    const f = await db.GetAssetFileById("0000000000000000f000000000000000");
    console.log(f);
}
main().catch(err => {
    console.error(err);
});