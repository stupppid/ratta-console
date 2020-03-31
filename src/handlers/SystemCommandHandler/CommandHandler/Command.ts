import commands from "../../../init/initFiles/bin";
import loadScript from 'load-script';
import CommandHandler from "./CommandHandler";
import compile from './compileCommand'

interface ICommand {
    url?: string
    path?: string
}

interface Runnable {
    run: (...args:any) => number
}

const allCommands = new Map<string, Runnable>()

function loadCommand(command: ICommand) {

    if(command.path !== undefined) {
        if(allCommands.has(command.path)) {
            allCommands.get(command.path)
        } else {
            // return new FileController().getFileByPath(command.path)
        }
    } else if(command.url) {
        if(allCommands.has(command.url)) {
            allCommands.get(command.url)
        } else {
            loadScript(command.url, function (err, script) {
                if(err) {

                } else {

                }
            })
        }

    }
}

/**
 * 多个view都可以共享
 */
export class Command {
    static run(handler:CommandHandler): (str: string) => Promise<any> {
        // todo 先从当前文件夹下找
        //  loadScript -> 已经加载就直接用本地的静态方法 | 本地store读取文件 | 远程获取
        return function(str: string): Promise<any>  {
            return new Promise(async function (resolve:(cs:any)=>any, reject) {
                try {
                    compile(str, commands, handler).then(resolve).catch(reject)
                } catch (e) {
                    reject(e)
                }
            })
        }
    }
}
