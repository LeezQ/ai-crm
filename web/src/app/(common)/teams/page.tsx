'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Upload, MoreVertical, Users } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    admin: '',
  });

  const queryClient = useQueryClient();

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: api.teams.list,
  });

  const createTeamMutation = useMutation({
    mutationFn: api.teams.create,
    onSuccess: () => {
      setShowCreateDialog(false);
      setNewTeam({ name: '', description: '', admin: '' });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const importMembersMutation = useMutation({
    mutationFn: api.teams.import,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(newTeam);
  };

  const handleImportMembers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importMembersMutation.mutate(file);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="">
      <div className="bg-background p-4 rounded-lg">
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="font-medium text-lg">团队管理</div>
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
        </div>
        <div>
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
              {Array.isArray(teams) && teams.map((team: Team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>{team.memberCount}</TableCell>
                  <TableCell>{team.admin}</TableCell>
                  <TableCell>{new Date(team.createTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Link href={`/teams/${team.id}`}>
                        查看成员
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}