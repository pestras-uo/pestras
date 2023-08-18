export async function resizeImageFIle(img: File, size: number, useHeight = false): Promise<File> {
  return new Promise((res, rej) => {
    const imgElm = new Image();

    imgElm.addEventListener('load', () => {
      const resizedDataUri = resizeImageElement(imgElm, size, useHeight, img.type);

      if (resizedDataUri)
        res(dataUrlToFile(resizedDataUri, img.name, img.type));

      rej(new Error("unable to resize image"));
    });

    fileToDataUrl(img).then(src => imgElm.src = src);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => e.target?.result ? res(e.target.result as string) : rej(null);
    reader.onerror = e => rej(e);
  });
}

export async function dataUrlToFile(url: string, name: string, type: string) {
  const res = await fetch(url);
  const blob = await res.blob();

  return new File([blob], name, { type })
}


export function resizeImageElement(imgEl: HTMLImageElement, size: number, useHeight = false, type?: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const aspect = imgEl.width / imgEl.height;

  if (!ctx)
    return null;

  canvas.width = useHeight ? size * aspect : size;
  canvas.height = useHeight ? size : size / aspect;

  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(type);
}