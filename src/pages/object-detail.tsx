import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { ObjectEditor } from '@/components/object/object-editor'
import { RelationshipsPanel } from '@/components/object/relationships-panel'
import { ActivityLog } from '@/components/object/activity-log'
import { ObjectThread } from '@/components/object/object-thread'

export default function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const object = useLifeOsStore((s) => s.lifeObjects.find((o) => o.id === id))
  const deleteLifeObject = useLifeOsStore((s) => s.deleteLifeObject)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!id || !object) {
    return <Navigate to="/" replace />
  }

  const objectId = object.id

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteLifeObject(objectId)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <Button variant={confirmDelete ? 'destructive' : 'ghost'} size="sm" onClick={handleDelete}>
          <Trash2 className="size-4" />
          {confirmDelete ? 'Confirm delete' : 'Delete'}
        </Button>
      </header>

      <ObjectEditor object={object} key={object.id} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjectThread objectId={object.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <RelationshipsPanel object={object} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">History</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog objectId={object.id} />
        </CardContent>
      </Card>
    </div>
  )
}
