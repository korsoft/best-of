

export enum BusinessMediaType {
    image,
    video
}

export default interface BusinessMedia {
    url: string,
    type: BusinessMediaType
}