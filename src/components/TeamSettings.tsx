import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { createFolder, createOrUpdateJsonFile, setPermission } from '@/lib/drive'
import { encryptJson } from '@/lib/utils'

interface TeamSettingsProps {
  accessToken: string
}

export function TeamSettings({ accessToken }: TeamSettingsProps) {
  const [open, setOpen] = useState(false)
  const [teamName, setTeamName] = useState('My Focus Team')
  const [passphrase, setPassphrase] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [folderId, setFolderId] = useState<string | null>(null)

  const handleCreateTeam = async () => {
    try {
      if (!passphrase) { toast.error('Nhập passphrase để mã hóa'); return }
      const folder = await createFolder(accessToken, teamName)
      setFolderId(folder.id)
      const teamMeta = { name: teamName, createdAt: new Date().toISOString(), version: 1 }
      const payload = await encryptJson(teamMeta, passphrase)
      await createOrUpdateJsonFile(accessToken, null, 'team.enc.json', payload, folder.id)
      await createOrUpdateJsonFile(accessToken, null, 'tasks.enc.json', await encryptJson([], passphrase), folder.id)
      await createOrUpdateJsonFile(accessToken, null, 'reminders.enc.json', await encryptJson([], passphrase), folder.id)
      toast.success('Đã tạo Team + file mã hóa trên Drive')
    } catch (e: any) {
      toast.error(e.message || 'Tạo Team thất bại')
    }
  }

  const handleInvite = async () => {
    try {
      if (!folderId) { toast.error('Chưa có thư mục Team'); return }
      await setPermission(accessToken, folderId, inviteEmail, 'writer')
      toast.success('Đã mời thành viên')
      setInviteEmail('')
    } catch (e: any) {
      toast.error(e.message || 'Mời thất bại')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Quản trị Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Quản trị Team (Google Drive)</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tạo Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label>Tên Team</Label>
                <Input value={teamName} onChange={e => setTeamName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Passphrase mã hóa (E2EE)</Label>
                <Input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} />
              </div>
              <Button onClick={handleCreateTeam}>Tạo Team</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mời thành viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label>Email thành viên</Label>
                <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="member@gmail.com" />
              </div>
              <Button variant="secondary" onClick={handleInvite} disabled={!folderId}>Mời</Button>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


