import path from 'path'

const prefix = (type) => {
    switch (type) {
        case 0:
            return ''
        case 1:
            return '~'
        case 2:
            return '*'
        case 3:
            return '!'
    }
}

const helpMsg = `
    ls [options] [path]
    list the files of the path inputted
    
    -h, --help  check the command
    -a, --all   place all the files
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
            case '-a':
            case '--all':
                config.all = true
                break
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
            let p = path.resolve(await state.getItem('account.currentPath'), config.path || '')
            if (!p.endsWith('/')) {
                p += '/'
            }
            let abpath = p
            if(p !== '/') {
                let f = await fileController.getFileByPath(p.slice(0, p.length - 1))
                if(f === undefined) {
                    throw new Error('file not exists')
                }
                if(f.type === 2) {
                    abpath = f.linkPath + '/'
                }
            }

            const arr = (await fileController.getSubFileByPath(abpath)).filter(v => !v.isDeleted)
            let msg
            if(config.all) {
                msg = arr.map(r => prefix(r.type) + path.relative(abpath, r.absolutePath)).join('  ')
            } else {
                msg = arr.filter(v => !v.absolutePath.startsWith('.')).map(r => prefix(r.type) + path.relative(abpath, r.absolutePath)).join('  ') || ''
            }
            return {
                code: 0,
                msg: msg || ''
            }
        }
    }
}
