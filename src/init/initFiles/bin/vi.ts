import * as path from 'path'
import {CommonInputHandler} from "../../../handlers/CommonInputHandler";
import {IStore} from "../../../index";
import './vi.css'
import {InputProxy} from "../../../handlers/InputProxy";

class VimHandler extends CommonInputHandler {
    inputEl:HTMLTextAreaElement
    private lastHandlerInput:string
    private readonly content: string
    private escaping: boolean = true
    private escapingEl: HTMLInputElement
    private errEl: HTMLDivElement
    private commanding: boolean = true
    private readonly abPath: string
    private done: boolean = false

    constructor(store: IStore, inputEl: HTMLTextAreaElement, inputProxy: InputProxy, abPath: string, content: string) {
        super(store, inputEl, inputProxy);
        this.abPath = abPath
        this.content = content
    }

    init():void {
        this.lastHandlerInput = this.inputEl.value
        this.inputEl.value = this.content
        this.escapingEl = document.createElement('input')
        this.escapingEl.className = 'vi-input-bottom'
        this.inputEl.parentElement.appendChild(this.escapingEl)
        this.escapingEl.addEventListener('keydown', this.handleKeyDown.bind(this))

        this.errEl = document.createElement('div')
        this.errEl.className = 'vi-input-error'
        this.inputEl.parentElement.appendChild(this.errEl)
    }

    destroy(): void {
        super.destroy();
        this.inputEl.value = this.lastHandlerInput
        this.inputEl.parentElement.removeChild(this.escapingEl)
        this.inputEl.parentElement.removeChild(this.errEl)
        // this.errEl = null
        // this.escapingEl = null
        this.inputEl.focus()
    }

    private checkEscaping() {
        this.escaping = !this.escaping
        if(!this.done) {
            if (this.escaping) {
                this.escapingEl.style.display = 'block'
                this.escapingEl.focus()
            } else {
                this.escapingEl.value = ''
                this.escapingEl.style.display = 'none'
                this.inputEl.focus()
            }
        }
    }

    private popHandler() {
        this.done = true
        this.inputProxy.popHandler()
    }

    private showError(e) {
        this.errEl.style.display = 'block'
        this.errEl.innerText = e
    }

    handleMouseDown(e: MouseEvent): void {
        super.handleMouseDown(e);
        // e.preventDefault()
    }

    handleKeyDown(e: KeyboardEvent): void {
        super.handleKeyDown(e);
        if(this.escaping) {
            switch (e.key) {
                case 'a':
                case 'i':
                    if(!this.commanding) {
                        this.checkEscaping()
                        e.preventDefault()
                    }
                    break
                case "u":
                    if(!this.commanding) {
                        e.preventDefault()
                    }
                    break
                case "d":
                    if(!this.commanding) {
                        e.preventDefault()
                    }
                    break
                case "w":
                    if(!this.commanding) {
                        e.preventDefault()
                    }
                    break
                case ":":
                    this.commanding = true
                    // e.preventDefault()
                    break
                case 'Enter':
                    try {
                        let value = this.escapingEl.value
                        if(this.escapingEl.value.startsWith(':')){
                            switch (this.escapingEl.value.substring(1).trim().split('').sort().join('')) {
                                case '!q':
                                    this.popHandler()
                                    break
                                case 'qw':
                                    this.store.fileController.saveContent(this.abPath, this.inputEl.value)
                                    this.popHandler()
                                    break
                                case 'q':
                                    if(this.inputEl.value !== this.content) {
                                        throw new Error('this file has been changed,input `q!` to quit without changing ')
                                    } else {
                                        this.popHandler()
                                    }
                                    break
                                case 'help':
                                    throw new Error('no help here, check the help by google~')
                                    break
                                default:
                                    throw new Error('this command does not exist')
                                    break
                            }
                        }
                        if(this.errEl !== null) {
                            this.errEl.style.display = 'none'
                        }
                        this.checkEscaping()
                    } catch (err) {
                        this.showError(err)
                    }
                    break
                case "Escape":
                    this.checkEscaping()
                    e.preventDefault()
                    break
                default:
                    // e.preventDefault()
                    break
            }
        } else {
            switch (e.key) {
                case "Escape":
                    this.checkEscaping()
                    e.preventDefault()
                    break
                default:
                    break
            }
        }
    }
}

export default {
    run(handler){
        return async (...args) => {
            const {fileController, state} = handler.store
            let p = await state.getItem('account.currentPath')
            let file = await fileController.getFileByPath(path.resolve(p, args[0]))
            if(file === undefined) {
                file = await fileController.getFileById(await fileController.addFile({
                    absolutePath: path.resolve(p, args[0])
                }))
            } else if(file.type === 2) {
                file = await fileController.getFileByPath(file.linkPath)
            } else if(file.type !== 0){
                throw new Error('the file already exists and cannot be edited')
            }
            return {
                code: 0,
                callBack: () => {
                    handler.inputProxy.setHandler(new VimHandler(handler.store, handler.inputEl, handler.inputProxy, file.absolutePath, file.content))
                }
            }
        }
    }
}
