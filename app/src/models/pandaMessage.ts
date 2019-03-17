export interface PandaMessage {
    sender: string,
    text: string,
    image: PandaImage,
    id: string
}

export interface PandaImage {
    url: string,
    height: number,
    width: number
}