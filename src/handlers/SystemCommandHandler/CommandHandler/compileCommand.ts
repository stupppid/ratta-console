const expressions = ['&&', '|', '>', '\n', ';']
// 转成表达式树
let expressionParser = (node) => {
    let cmd = node.command.trim()
    let exp = undefined
    let arr = []
    for(let expression of expressions) {
        let index = cmd.lastIndexOf(expression)
        if(index > 0) {
            exp = expression
            arr = [
                cmd.slice(0, index),
                cmd.slice(index + exp.length, cmd.length)
            ]
            break
        }
    }
    if(exp !== undefined) {
        node.expression = exp
        node.command = undefined
        node.left = {
            command: arr[0]
        }
        node.right = {
            command: arr[1]
        }
        expressionParser(node.left)
        expressionParser(node.right)
    }
    return node
}
// 将命令转化为数组
function getArgs(str) {
    str = ` ${str.trim()} `
    const chars = ['\'', '\"']
    let spIndex = 0
    let args = []
    let flag = -1
    let indexes = new Array(chars.length)
    for(let i = 0; i < str.length; i++) {
        if(str[i - 1] === ' ' && str[i] !== ' ' && flag === -1) {
            for(let j = 0; j < chars.length; j++) {
                if(str[i] === chars[j]) {
                    flag = j
                    indexes[flag] = i
                    break
                }
            }
            if(flag === -1) {
                spIndex = i
            }
        } else {
            if(spIndex && (str[i - 1] !== ' ' && str[i] === ' ')) {
                args.push(str.slice(spIndex, i))
                spIndex = 0
            }else if(indexes[flag] && str[i] === chars[flag]) {
                args.push(str.slice(indexes[flag] + 1, i))
                indexes[flag] = 0
                flag = -1
            }
        }
    }
    return args
}
// 将表达式树转化为可运行的promise返回
function compile(commands, handler) {
    return async function cp(node) {
        if(node.command !== undefined) {
            let args = getArgs(node.command)
            let func = args.shift()
            if(commands[func] === undefined) {
                let mh = 'mh'
                throw new Error(`command ${func} not found, do you mean : ${mh}`)
            }
            return commands[func].run(handler)(...args)
        }
        switch (node.expression) {
            case '&&':
                return cp(node.left).then((res) => {
                    if(res.code === 0) {
                        return cp(node.right)
                    } else {
                        throw Error()
                    }
                })
            case '|':
                return cp(node.left).then((res) => {
                    if(res.code === 0) {
                        return cp({
                            ...node.right,
                            command: node.right.command ? node.right.command + ' \"' + res.msg + '\"' : undefined
                        })
                    }
                })
            case '>':
                return cp(node.left).then((res) => {
                    console.log(`touch ${node.right.command} -c ${res.msg}`)
                    if(res.code === 0) {
                        return cp({
                            ...node.right,
                            command: `touch ${node.right.command} -c "${res.msg}"`
                        })
                    }
                })
            case '\n':
            case ';':
                return cp(node.left).then(async (res) => {
                    if(res.code === 0) {
                        let res1 = await cp(node.right)
                        return {
                            code: res1.code,
                            msg: res.msg + '\n' + res1.msg
                        }
                    } else {

                    }
                })
            default:
                break
        }
    }
}

export default function (command, commands, handler) {
    return compile(commands,handler)(expressionParser({
        command
    }))
}
