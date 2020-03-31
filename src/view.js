import {viewRunner} from "./index";
import {store} from "ratta/src/index";

window.addEventListener('DOMContentLoaded', () => {
    viewRunner.run(store, document.body)
})
