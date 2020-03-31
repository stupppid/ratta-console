import path from 'path'

const helpMsg = `
    -h, --help  check the command
`

const getConfig = (...args) => {
    let config = {
        path: ''
    }
    while (args.length > 0) {
        let arg = args.shift()
        switch (arg) {
            case '-h':
            case '--help':
                config.help = true
                return config
            default:
                config.path = arg
                break
        }
    }
    return config
}

export default {
    run(handler) {
        return async (...args) => {
            const {fileController, state} = handler.store
            let config = getConfig(...args)

            if(config.help) {
                return {
                    code: 0,
                    msg: helpMsg
                }
            }
            let p = path.resolve(await state.getItem('account.currentPath'), config.path)
            const file = await fileController.getFileByPath(p)
            if(file === undefined || file.type !== 0) {
                throw new Error('file not found')
            }
            return {
                code: 0,
                msg: file.content || ''
            }
        }
    }
}
