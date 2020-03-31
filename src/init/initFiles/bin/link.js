import path from 'path'
import {validateFileName} from "./validate";
import {RtFile} from "ratta";

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
            } else if(file.type === 2) {
                await fileController.addFile(new RtFile(file, {
                    absolutePath: path.resolve(basePath, args[1]),
                    linkPath: file.linkPath,
                    type: 2,
                }))
            } else {
                await fileController.addFile(new RtFile(file, {
                    absolutePath: path.resolve(basePath, args[1]),
                    linkPath: file.absolutePath,
                    type: 2,
                }))
            }
            return {
                code: 0
            }
        }
    }
}
