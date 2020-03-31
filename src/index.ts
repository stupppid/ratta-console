import './index.css'
import {InputProxy} from "./handlers/InputProxy";
import StepHandler from "./handlers/SystemCommandHandler/StepHandler";
import {initSystemStep} from "./init/initSystemSteps";
import SystemCommandHandler from "./handlers/SystemCommandHandler/CommandHandler/SystemCommandHandler";
import {loginSteps} from "./init/loginSteps";
import {store, state, fileController, accountController} from 'ratta'

class consoleView {
    inputProxy:InputProxy
    inputEl
    constructor(inputProxy, store, root) {
        let rt = document.createElement('div')
        rt.className = 'cv'
        root.appendChild(rt)
        this.inputProxy = inputProxy
        this._addEventListener(rt)
        inputProxy.store = store
    }

    _addEventListener(root) {
        root.innerHTML = `<textarea class="console-view"></textarea>`
        this.inputEl = root.querySelector('.console-view')
        this.inputEl.addEventListener('keydown', (e) => this.inputProxy.handleKeyDown(e))
        this.inputEl.addEventListener('input', (e) => this.inputProxy.handleInput(e))
        this.inputEl.addEventListener('keyup', (e) => this.inputProxy.handleKeyUp(e))
        this.inputEl.addEventListener('input', (e) => this.inputProxy.handleInput(e))
        this.inputEl.addEventListener('mousedown', (e) => this.inputProxy.handleMouseDown(e))
        this.inputEl.addEventListener('mouseup', (e) => this.inputProxy.handleMouseUp(e))
        this.inputEl.addEventListener('click', (e) => this.inputProxy.handleClick(e))
    }
}

export const viewRunner = {
    async run(store, root) {
        // 所有input事件交给inputProxy来处理, 一个consoleView的inputProxy是唯一的
        let inputProxy = new InputProxy()
        let cv = new consoleView(inputProxy, store, root)
        console.log(321)
        if (await store.state.getItem('$SYSTEM') === undefined) {
            inputProxy.setHandler(new StepHandler(store, cv.inputEl, inputProxy, initSystemStep, new SystemCommandHandler(store, cv.inputEl, inputProxy)))
        } else if (await store.state.getItem('$CURRENT_ACCOUNT', 1) === undefined) {
            inputProxy.setHandler(new StepHandler(store, cv.inputEl, inputProxy, loginSteps, new SystemCommandHandler(store, cv.inputEl, inputProxy)))
        } else {
            inputProxy.setHandler(new SystemCommandHandler(store, cv.inputEl, inputProxy))
        }
    }
}

export interface IStore{
    fileController: typeof fileController
    accountController: typeof accountController
    state: typeof state
}

