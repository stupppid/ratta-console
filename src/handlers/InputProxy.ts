import {CommonInputHandler, IInputHandler} from "./CommonInputHandler";
import {autorun, IObservableValue, observable} from "mobx";

/**
 * 要保证一个session上 只有一个handler
 * inputProxy 会存取当前app
 */
export class InputProxy {
    stdin:IObservableValue<String> = observable.box('')
    stdout:IObservableValue<String> = observable.box('')
    stderr:IObservableValue<String> = observable.box('')
    private handlers:Array<IInputHandler> = []
    private currentHandler: IInputHandler
    private lastStdout:String
    private lastStdin:String
    private lastStderr:String

    constructor() {
        autorun(() => {
            let str = this.stdout.get()
            this.currentHandler && this.currentHandler.handleStdoutChange(str, this.lastStdout)
            this.lastStdout = str
        })
        autorun(() => {
            let str = this.stdin.get()
            this.currentHandler && this.currentHandler.handleStdinChange(str, this.lastStdin)
            this.lastStdin = str
        })
        autorun(() => {
            let str = this.stderr.get()
            this.currentHandler && this.currentHandler.handleStdoutChange(str, this.lastStderr)
            this.lastStderr = str
        })
    }

    setHandler(handler: IInputHandler):void {
        this.handlers.push(handler)
        this.currentHandler = handler
        this.currentHandler.init()
    }

    popHandler():void {
        if(this.handlers.length > 1){
            this.currentHandler.destroy()
            this.handlers.pop()
            this.currentHandler = this.handlers[this.handlers.length - 1]
            this.currentHandler.init()
        } else {
            throw new Error('no handler can be popped')
        }
    }

    replaceHandler(handler: CommonInputHandler):void {
        this.currentHandler.destroy()
        this.currentHandler = handler
        this.currentHandler.init()
    }

    handleInput(e:InputEvent) {
        this.currentHandler.handleInput(e)
    }
    handleKeyDown(e:KeyboardEvent) {
        this.currentHandler.handleKeyDown(e)
    }
    handleKeyUp(e:KeyboardEvent) {
        this.currentHandler.handleKeyUp(e)
    }
    handleKeyPress(e:KeyboardEvent) {
        this.currentHandler.handleKeyPress(e)
    }
    handleMouseDown(e:MouseEvent) {
        this.currentHandler.handleMouseDown(e)
    }
    handleMouseUp(e:MouseEvent) {
        this.currentHandler.handleMouseUp(e)
    }
    handleClick(e:MouseEvent) {
        this.currentHandler.handleClick(e)
    }
}
