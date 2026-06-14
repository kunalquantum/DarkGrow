import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.resolve(__dirname, '../public/icons')

const BG = '#111113'
const FG = '#ffffff'

function baseSvg({ size, padding = 0 }) {
  const inner = size - padding * 2
  const cx = size / 2
  const cy = size / 2
  const ringRadius = inner * 0.32
  const dotRadius = inner * 0.07
  const ringWidth = inner * 0.045

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${BG}" />
  <circle cx="${cx}" cy="${cy}" r="${ringRadius}" fill="none" stroke="${FG}" stroke-width="${ringWidth}" />
  <circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${FG}" />
</svg>`
}

async function main() {
  await mkdir(iconsDir, { recursive: true })

  const iconSvg = baseSvg({ size: 512 })
  await writeFile(path.join(iconsDir, 'icon.svg'), iconSvg, 'utf-8')

  const standard = sharp(Buffer.from(iconSvg))
  await standard.clone().resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'))
  await standard.clone().resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'))
  await standard.clone().resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'))
  await standard.clone().resize(32, 32).png().toFile(path.join(iconsDir, 'favicon-32.png'))
  await standard.clone().resize(16, 16).png().toFile(path.join(iconsDir, 'favicon-16.png'))

  const maskableSvg = baseSvg({ size: 512, padding: 80 })
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'))

  console.log('Generated PWA icons in', iconsDir)
}

main()
