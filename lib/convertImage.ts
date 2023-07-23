import sharp from "sharp";

export default async function convertImage(filePath?: string): Promise<Buffer> {
  return sharp(filePath).toFormat("webp").toBuffer();
}
