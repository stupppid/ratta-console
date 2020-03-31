import {IStore} from "../index";
import {InputProxy} from "./InputProxy";

export interface IInputHandler {
    handleKeyUp(e:KeyboardEvent):void
    handleKeyDown(e:KeyboardEvent):void
    handleInput(e:InputEvent):void
    handleKeyPress(e:KeyboardEvent):void
    handleClick(e: MouseEvent): void
    handleMouseUp(e: MouseEvent): void
    handleMouseDown(e: MouseEvent): void
    handleStdoutChange(value:String, oldValue:String): void
    handleStdinChange(value:String, oldValue:String): void
    handleStderrChange(value:String, oldValue:String): void
    destroy():void
    init():void
}

enum REPLACE_STDOUT_TYPE {
    WORD,
    LINE,
    PAGE,
}

/**
 * 一个session只有一个stdin
 */
export class CommonInputHandler implements IInputHandler{
    store:IStore
    inputEl:HTMLTextAreaElement
    inputProxy: InputProxy

    constructor(store?:IStore, inputEl?:HTMLTextAreaElement, inputProxy?: InputProxy) {
        this.store = store
        this.inputEl = inputEl
        this.inputProxy = inputProxy
    }

    init():void {}
    destroy():void {}
    handleKeyDown(e: KeyboardEvent): void {}
    handleKeyUp(e: KeyboardEvent): void {}
    handleInput(e: InputEvent): void {}
    handleKeyPress(e: KeyboardEvent): void {}
    handleClick(e: MouseEvent): void {}
    handleMouseUp(e: MouseEvent): void {}
    handleMouseDown(e: MouseEvent): void {}
    handleStdoutChange(value:string, oldValue:string): void {}
    handleStdinChange(value:string, oldValue:string): void {}
    handleStderrChange(value:string, oldValue:string): void {}

    print(content: string): void {
        // this.inputProxy.stdout = content
        this.inputEl.value += content
        this.inputEl.scrollTo({
            top: this.inputEl.scrollHeight
        })
    }

    replace(content: string, type: number = 0, length: number = 1): void {
        switch (type) {
            case REPLACE_STDOUT_TYPE.WORD:
                this.inputEl.value = this.inputEl.value.slice(0, this.inputEl.value.length - length) + content
                break
            case REPLACE_STDOUT_TYPE.LINE:
                break
            case REPLACE_STDOUT_TYPE.PAGE:
                break
            default:
                break
        }

    }
}
