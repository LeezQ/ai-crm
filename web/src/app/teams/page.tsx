'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, MoreVertical } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createTime: string;
  admin: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    admin: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('获取团队列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });
      if (response.ok) {
        setShowCreateDialog(false);
        setNewTeam({ name: '', description: '', admin: '' });
        fetchTeams();
      }
    } catch (error) {
      console.error('创建团队失败:', error);
    }
  };

  const handleImportMembers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/teams/import', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        fetchTeams();
      }
    } catch (error) {
      console.error('导入成员失败:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>团队管理</CardTitle>
          <div className="flex gap-2">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  创建团队
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新团队</DialogTitle>
                  <DialogDescription>
                    填写团队信息以创建新团队
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">团队名称</Label>
                    <Input
                      id="name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">团队描述</Label>
                    <Input
                      id="description"
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin">团队管理员</Label>
                    <Input
                      id="admin"
                      value={newTeam.admin}
                      onChange={(e) => setNewTeam({ ...newTeam, admin: e.target.value })}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">创建</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              导入成员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>团队名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>成员数量</TableHead>
                <TableHead>管理员</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell>{team.admin}</TableCell>
                  <TableCell>{new Date(team.createTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}