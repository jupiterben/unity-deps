import { PrismaClient } from '@prisma/client'


export class UnityAssetDB {
    prisma = new PrismaClient()

    public async AddAssetFile(uid: string, path: string, refs: string[]) {
        const refData = refs.map(ref => ({ uid: ref }));
        await this.prisma.assetFile.upsert({
            where: { uid },
            update: { path },
            create: {
                uid, path, refFiles: { connect: refData }
            }
        })
    }
    public async GetAssetFileById(uid: string) {
        return await this.prisma.assetFile.findUnique({
            where: { uid }
        })
    }
}


