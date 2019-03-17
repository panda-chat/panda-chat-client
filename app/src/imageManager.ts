import { ILogManager } from "./logManager";

export class ImageManager {
    private _logManager: ILogManager
    private _document: Document

    /* 
    Image manager is used to capture onpaste events by the user as well as pass around images
    between the canvas, the chat, and the websocket
    */
    constructor(){
        this._document = document
    }


}


// //todo implement this in the image manager
// //Code for copying from clipboard taken from here - https://stackoverflow.com/a/15369753
// this._chatContainerTextArea.onpaste = (event: any) => {
//     // use event.originalEvent.clipboard for newer chrome versions
//     var items = (event.clipboardData  || event.originalEvent.clipboardData).items
//     // find pasted image among pasted items
//     let blob: Blob = null
//     for (var i = 0; i < items.length; i++) {
//         if (items[i].type.indexOf("image") === 0) {
//             blob = items[i].getAsFile()
//         }
//     }
//     // load image if there is a pasted image
//     if (blob !== null) {
//         var reader = new FileReader()
//         reader.onload = (event) => {
//             document.getElementById("image-box").setAttribute('src', (<any>event.target).result)
//             this._img_blob = blob
//         }
//         reader.readAsDataURL(blob)
//     }
// }