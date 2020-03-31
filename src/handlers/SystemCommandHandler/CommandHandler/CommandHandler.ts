import {CommonInputHandler} from "../../CommonInputHandler";
import {InputProxy} from "../../InputProxy";
import {IStore} from "../../../index";


/**
 * handler可以从inputProxy中获取stdin和stdout
 * 从store中获取数据
 */
export default class CommandHandler extends CommonInputHandler{
    inputProxy: InputProxy;
    store:IStore  // 文件 文件内容 账户 环境变量 cs 的数据
    inputEl:HTMLTextAreaElement

    private stdinSeek:number = 0
    private stdinLength: number = 0
    private historySeek: number = 0
    history:Array<string> = []
    protected commandHandler:Function = function(){}

    constructor(store:IStore, inputEl:HTMLTextAreaElement, inputProxy: InputProxy, commandHandler?:Function) {
        super(store, inputEl, inputProxy)
        this.commandHandler = commandHandler
    }

    protected get stdin() {
        if(this.stdinLength < 1){
            return ''
        }
        return this.inputEl.value.substr(-this.stdinLength)
    }
    private changeCommandInHistory() {
        const command = this.history[this.history.length - 1 - this.historySeek]
        this.inputEl.value = this.inputEl.value.slice(0, this.inputEl.value.length - this.stdinLength) + command
        this.stdinLength = command.length
        this.stdinSeek = 0
    }

    private dispatchKeyEvent(key, type:string = 'keydown'){
        let event = new KeyboardEvent(type,{
            key: key,
            // code: key,
            composed: true,
            cancelable: true,
            bubbles: true,
        })
        // @ts-ignore
        event['keyCode'] = 37
        this.inputEl.dispatchEvent(event)
    }

    handleKeyDown(e: KeyboardEvent): void {
        super.handleKeyDown(e);
        if(e.key.length > 1) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault()
                    this.commandHandler(this.stdin)
                    this.stdinLength = 0
                    this.stdinSeek = 0
                    this.historySeek = -1
                    break
                case 'Tab':
                    e.preventDefault()
                    // Command.run(this)('ls').then(r => {
                    //     let tips = []
                    //     r.msg.split(' ').forEach(subVal => {
                    //         if(subVal.startsWith(this.stdin)) {
                    //             tips.push(subVal)
                    //         }
                    //     })
                    //     tips = tips.sort((a,b) => b.length - a.length)
                    //     this.dispatchKeyEvent('Enter')
                    // })
                    // todo 智能提示
                    break
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    e.preventDefault()
                    if(this.historySeek > 0) {
                        --this.historySeek
                        this.changeCommandInHistory()
                    }
                    break;
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    e.preventDefault()
                    if(this.historySeek < this.history.length - 1) {
                        ++this.historySeek
                        this.changeCommandInHistory()
                    }
                    break;
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    if (this.stdinSeek < this.stdinLength) {
                        this.stdinSeek += 1
                    } else {
                        e.preventDefault()
                    }
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    if (this.stdinSeek > 0) {
                        this.stdinSeek -= 1
                    }
                    break;
                case "Backspace":
                    if(this.stdinSeek >= this.stdinLength || e.ctrlKey) {
                        e.preventDefault()
                    } else {
                        this.stdinLength--
                    }
                    break
                case "Home":
                    // 手动触发事件不会生成与该事件关联的默认操作，尽量不用hack方法实现
                    e.preventDefault()
                    break
                case "End":
                    e.preventDefault()
                    break
                default:
                    e.preventDefault()
                    break
            }
        } else {
            this.stdinLength++
        }
    }

    handleMouseDown(e: MouseEvent): void {
        super.handleMouseDown(e);
        this.inputEl.focus()
        e.preventDefault()
    }
}
