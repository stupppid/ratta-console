const helpMsg = `
    -g, --gid GROUP
    The group name of the user's initial login group. The group name must exist. A group number must refer to an already existing group.
    If not specified, the bahavior of useradd will depend on the USERGROUPS_ENAB variable in /etc/login.defs. If this variable is set to yes (or -U/--user-group is specified on the command line), a group will be created for the user, with the same name as her loginname. If the variable is set to no (or -N/--no-user-group is specified on the command line), useradd will set the primary group of the new user to the value specified by the GROUP variable in /etc/default/useradd, or 100 by default.
    
    -G, --groups GROUP1[,GROUP2,...[,GROUPN]]]
    A list of supplementary groups which the user is also a member of. Each group is separated from the next by a comma, with no intervening whitespace. The groups are subject to the same restrictions as the group given with the -g option. The default is for the user to belong only to the initial group.
    -h, --help
    Display help message and exit.
    -p, --password PASSWORD
    The encrypted password, as returned by crypt(3). The default is to disable the password.
    Note: This option is not recommended because the password (or encrypted password) will be visible by users listing the processes.
    
    You should make sure the password respects the system's password policy.
`

const getConfig = (...args) => {
    let config = {
        groups: [],
    }
    while (args.length > 0) {
        let arg = args.shift()
        switch (arg) {
            case '-h':
            case '--help':
                config.help = true
                return config
            case '-g':
            case '--gid':
                config.gid = args.shift()
                break
            case '-p':
            case '--password':
                config.password = args.shift()
                break
            case '-G':
            case '--groups':
                let groups = []
                while (!args[0].startsWith('-')) {
                    if((args.length === 1 && args.username === undefined)) {
                        break
                    } else {
                        groups.push(args.shift())
                    }
                }
                config.groups = groups
                break
            default:
                config.username = arg
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
            if(!config.password) {
                throw new Error('--password must be set')
            }
            if(config.groups.length > 0 && typeof config.gid === "string") {
                throw new Error('--gid and --groups cannot be assign meanwhile')
            }

            if(config.groups.length > 0) {
                await accountController.addAccount(config.username, config.password,null, config.groups)
            } else if(typeof config.gid === "string") {
                await accountController.addAccount(config.username, config.password, null, [config.gid])
            } else {
                await accountController.addAccount(config.username, config.password)
            }
            return {
                code: 0,
            }
        }
    }
}
