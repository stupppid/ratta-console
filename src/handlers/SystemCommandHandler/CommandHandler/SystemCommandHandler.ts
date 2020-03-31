import {InputProxy} from "../../InputProxy";
import {IStore} from "../../../index";
import CommandHandler from "./CommandHandler";
import {Command} from "./Command";


/**
 * handler可以从inputProxy中获取stdin和stdout
 * 从store中获取数据
 */
export default class SystemCommandHandler extends CommandHandler{
    inputProxy: InputProxy;
    store:IStore  // 文件 文件内容 账户 环境变量 cs 的数据
    inputEl:HTMLTextAreaElement
    prefix:string

    constructor(store:IStore, inputEl:HTMLTextAreaElement, inputProxy: InputProxy) {
        super(store, inputEl, inputProxy)
        this.commandHandler = this.executeCommandHandler
        // window.$c = this.Command.run(this)
    }

    init() {
        Promise.all([this.store.state.getItem('$CURRENT_ACCOUNT.name', 1),this.store.state.getItem('$SYSTEM.name')]).then(values => {
            this.prefix = `\n${values[0]}@${values[1]}: `
            this.print(this.prefix)
        })
    }

    handleStdoutChange(value: string, oldValue: string): void {
        super.handleStdoutChange(value, oldValue);
    }

    handleStderrChange(value: string, oldValue: string): void {
        super.handleStderrChange(value, oldValue);
    }

    executeCommandHandler(command) {
        command = command.trim()
        if(command.length > 0) {
            this.history.push(command)
            Command.run(this)(command).then((obj) => {
                if(obj.msg !== undefined) {
                    this.inputProxy.stdout.set(new String(obj.msg))
                    this.print('\n' + this.inputProxy.stdout)
                }
                this.print(this.prefix)
                obj.callBack && obj.callBack()
                return obj
            }).catch(err => {
                console.error(err)
                this.inputProxy.stderr.set(new String(err))
                this.print('\n' + this.inputProxy.stderr + this.prefix)
            })
        } else {
            this.print(this.prefix)
        }
    }
}
