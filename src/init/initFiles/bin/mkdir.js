import path from 'path'
import {validateFileName} from "./validate";

export default {
    run(handler) {
        return async (...args) => {
            const {fileController, state} = handler.store
            if(args.length > 0) {
                for(let p of args) {
                    if(!p.startsWith('-')) {
                        validateFileName(p)
                    }
                }
                const basePath = await state.getItem('account.currentPath')
                await fileController.bulkAddFile(args.map(r => ({
                    absolutePath: path.resolve(basePath, r),
                    type: 1
                })))
            } else {
                throw new Error('file names was not input')
            }
            return {
                code: 0
            }
        }
    }
}

