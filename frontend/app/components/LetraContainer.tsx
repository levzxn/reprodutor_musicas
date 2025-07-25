export default function LetraContainer({ letra }: { letra?: string }) {
    return (
        <div className="flex items-center justify-center w-1/2 pl-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 w-full h-full flex items-center justify-center border border-white/10">
                <div className="text-center">
                    <h2 className="text-white/90 text-xl font-semibold mb-4">Letra da música</h2>
                    <div className="text-white/70 text-sm leading-relaxed max-h-96 overflow-y-auto">
                        <p className="mb-3">Aqui apareceria a letra da música...</p>
                        <p className="text-white/50">Carregando letra...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}