export function BlackBlur() {
    return (
        <div className="absolute inset-0 bg-black opacity-40 via-transparent to-black/80 pointer-events-none"></div>
    )
}

export function BackgroundImage({imgSrc = "/seujorge.jpg"} : {imgSrc?: string}) {
    return (
        <img
            src={imgSrc}
            className="absolute top-0 left-0 w-full h-full object-cover blur-[30px]"
            alt="fundo"></img>
    )
}
