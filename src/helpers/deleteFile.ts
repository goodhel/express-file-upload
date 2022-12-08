import { unlink } from "fs/promises"

const deleteFile = async (url: string) => {
    try {
        await unlink(url)
        console.log(`Successful delete ${url}`)
        return true
    } catch (error) {
        console.error(`Delete error: `, error)
        return false
    }
}

export default deleteFile
