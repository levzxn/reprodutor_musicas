function calcularCorMediaDaImagem(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;
      let totalRed = 0;
      let totalGreen = 0;
      let totalBlue = 0;
      if (!data) {
        reject(new Error("Não foi possível obter os dados da imagem"));
        return;
      }
      for (let i = 0; i < data.length; i += 4) {
        totalRed += data[i];
        totalGreen += data[i + 1];
        totalBlue += data[i + 2];
      }
      const pixelCount = data.length / 4;
      const averageRed = totalRed / pixelCount;
      const averageGreen = totalGreen / pixelCount;
      const averageBlue = totalBlue / pixelCount;
      // Escurecendo a cor média em 50%
      const darkenedRed = Math.max(0, averageRed * 0.4);
      const darkenedGreen = Math.max(0, averageGreen * 0.4);
      const darkenedBlue = Math.max(0, averageBlue * 0.4);
      const darkenedColor = `rgb(${darkenedRed.toFixed(0)}, ${darkenedGreen.toFixed(
        0
      )}, ${darkenedBlue.toFixed(0)})`;
      resolve(darkenedColor);
    };
    image.onerror = function(error) {
      reject(new Error("Erro ao carregar a imagem"));
    };
    image.src = imageUrl;
  });
}

export default calcularCorMediaDaImagem;
