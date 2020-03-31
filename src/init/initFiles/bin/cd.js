import path from 'path'

export default {
     run(handler){
        return async (...args) => {
            const {fileController, state} = handler.store
            let p = await state.getItem('account.currentPath')
            let file = await fileController.getFileByPath(path.resolve(p, args[0]))
            if(file === undefined) {
                throw new Error('the folder does not exist')
            }
            switch (file.type) {
                case 1:
                    await state.setItem('account.currentPath',  file.absolutePath)
                    break
                case 2:
                    await state.setItem('account.currentPath',  file.linkPath)
                    break
                default:
                    throw new Error('the folder does not exist')
            }
            return {
                code: 0
            }
        }
    }
}
