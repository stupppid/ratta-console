import path from 'path'
import {validateFileName} from "./validate";

const helpMsg = `
    touch [options] [path]
    create a file
    
    -h, --help  check the command
    -c, --content   assign the content
        when you use this config, you can only make one file
    -f, --force     overwrite the old file
`

const getConfig = (...args) => {
    let config = {
        path: [],
        force: false
    }
    while (args.length > 0) {
        let arg = args.shift()
        switch (arg) {
            case '-h':
            case '--help':
                config.help = true
                return config
            case '-c':
            case '--content':
                config.content = args.shift()
                break
            case '-f':
            case '--force':
                config.force = true
                break
            default:
                config.path.push(arg)
                break
        }
    }
    return config
}


export default {
    run(handler) {
        return async (...args) => {
            let config = getConfig(...args)
            if(config.help) {
                return {
                    code: 0,
                    msg: helpMsg
                }
            }
            const {fileController, state} = handler.store
            if(config.path.length > 0) {
                for(let p of config.path) {
                    validateFileName(p)
                }
                const basePath = await state.getItem('account.currentPath')
                if(config.content) {
                    if(config.path.length > 1) {
                        throw new Error('arguments error, you can only create one file when assign the content')
                    }
                    await fileController.addFile({
                        absolutePath: path.resolve(basePath, config.path[0]),
                        content: config.content
                    },config.force)
                } else {
                    await fileController.bulkAddFile(config.path.map(r => ({
                        absolutePath: path.resolve(basePath, r)
                    })),config.force)
                }
            } else {
                throw new Error('file names were not input')
            }
            return {
                code: 0
            }
        }
    }
}
