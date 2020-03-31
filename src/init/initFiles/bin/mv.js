import path from 'path'

export default {
    run(handler){
        return async (...args) => {
            if(args.length < 2) {
                throw new Error('arguments should be two')
            }
            const {fileController, state} = handler.store
            // for(let p of args) {
            //     if(!p.startsWith('-')) {
            //         validateFileName(path.basename(p))
            //     }
            // }
            const basePath = await state.getItem('account.currentPath')
            let t = await fileController.moveFile(path.resolve(basePath, args[0]), path.resolve(basePath, args[1]))
            if(t !== 1) {
                throw new Error('move file failed')
            }
            return {
                code: 0
            }
        }
    }
}
