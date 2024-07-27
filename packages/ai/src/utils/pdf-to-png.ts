import { fromBuffer } from "pdf2pic";

export async function pdfToPng(props: { buffer: Buffer; pages?: number[] }) {
  const convert = fromBuffer(props.buffer, {
    density: 300,
    format: "png",
    height: 3507,
    saveFilename: "untitled",
    savePath: "./",
    width: 2481,
  });

  return convert.bulk(props.pages ?? -1, {
    responseType: "base64",
  });
}
