import path from 'path'
import {validateFileName} from "./validate";
import {RtFile} from "ratta";

function cpFile(file, absolutePath) {
    let f = new RtFile(file, {absolutePath})
    return f
}

export default {
    run(handler){
        return async (...args) => {
            if(args.length < 2) {
                throw new Error('arguments should be two')
            }
            const {fileController, state} = handler.store
            for(let p of args) {
                if(!p.startsWith('-')) {
                    validateFileName(path.basename(p))
                }
            }
            const basePath = await state.getItem('account.currentPath')
            let file = await fileController.getFileByPath(path.resolve(basePath, args[0]))
            if(file === undefined) {
                throw new Error('base file is not found')
            } else if(file.type === 1) {
                let filePath = path.resolve(basePath, args[0])
                let files = await fileController.getSubFileByPath(filePath, RtFile.MAX_FILE_LEVEL)
                await fileController.bulkAddFile([
                    cpFile(file, path.resolve(basePath, args[1])),
                    ...files.map(f => cpFile(f, path.resolve(basePath, args[1], path.relative(filePath, f.absolutePath))))
                ])
            } else {
                await fileController.addFile(cpFile(file, path.resolve(basePath, args[1])))
            }
            return {
                code: 0
            }
        }
    }
}
