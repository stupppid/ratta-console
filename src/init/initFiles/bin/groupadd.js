const helpMsg = `
    groupAdd [options] [name]

    -h, --help
    Display help message and exit.
`

const getConfig = (...args) => {
    let config = {}
    while (args.length > 0) {
        let arg = args.shift()
        switch (arg) {
            case '-h':
            case '--help':
                config.help = true
                return config
            default:
                config.groupName = arg
                break
        }
    }
    return config
}

export default {
    run(handler) {
        return async (...args) => {
            const {accountController, state} = handler.store
            let config = getConfig(...args)

            if(config.help) {
                return {
                    code: 0,
                    msg: helpMsg
                }
            }
            if(!config.groupName) {
                throw new Error('groupName must be set')
            }
            await accountController.addGroup(config.groupName)
            return {
                code: 0,
            }
        }
    }
}
