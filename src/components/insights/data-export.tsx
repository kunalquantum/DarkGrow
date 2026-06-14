import { useRef, useState } from 'react'
import { Check, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLifeOsStore, type LifeOsData } from '@/store/lifeOsStore'

export function DataExport() {
  const exportData = useLifeOsStore((s) => s.exportData)
  const importData = useLifeOsStore((s) => s.importData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imported, setImported] = useState(false)

  function handleExport() {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `life-os-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const text = await file.text()
    const data = JSON.parse(text) as Partial<LifeOsData>
    importData(data)
    setImported(true)
    setTimeout(() => setImported(false), 1500)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Export everything you've tracked — objects, reflections, mood, life patterns, and energy logs — as a single
        JSON file for backup or your own analysis.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleExport} variant="accent" size="sm">
          <Download className="size-3.5" />
          Export data
        </Button>
        <Button onClick={handleImportClick} variant="outline" size="sm">
          {imported ? <Check className="size-3.5" /> : <Upload className="size-3.5" />}
          {imported ? 'Imported' : 'Import data'}
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  )
}
