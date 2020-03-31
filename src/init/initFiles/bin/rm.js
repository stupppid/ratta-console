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
                await fileController.bulkDeleteFile(args.map(r => path.resolve(basePath, r)), true)
            } else {
                throw new Error('file names were not input')
            }
            return {
                code: 0
            }
        }
    }
}
