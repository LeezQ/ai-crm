'use client';

import { useState } from 'react';
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
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Team, TeamMember } from '@/lib/api';

// Type for the add member form state
type NewMemberForm = { email: string; role: 'admin' | 'member' };

export default function TeamMembersPage() {
  const params = useParams();
  const [showAddDialog, setShowAddDialog] = useState(false);
  // State for the add member form, matching the api.teams.members.add input type
  const [newMember, setNewMember] = useState<NewMemberForm>({
    email: '',
    role: 'member',
  });

  const queryClient = useQueryClient();

  const teamId = params.id as string;

  const { data: team, isLoading: isLoadingTeam } = useQuery<Team>({
    queryKey: ['team', teamId],
    queryFn: () => api.teams.get(teamId),
    enabled: !!teamId,
  });

  const { data: members = [], isLoading: isLoadingMembers } = useQuery<TeamMember[]>({
    queryKey: ['team-members', teamId],
    queryFn: () => api.teams.members.list(teamId),
    enabled: !!teamId,
  });

  // Use the NewMemberForm type for the mutation input
  const addMemberMutation = useMutation({
    mutationFn: (member: NewMemberForm) => api.teams.members.add(teamId, member),
    onSuccess: () => {
      setShowAddDialog(false);
      setNewMember({ email: '', role: 'member' }); // Reset form
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
    },
    onError: (error) => {
      console.error("添加成员失败:", error);
      alert("添加成员失败: " + (error instanceof Error ? error.message : String(error)));
    }
  });

  const removeMemberMutation = useMutation({
    // Expect memberId as number
    mutationFn: (memberId: number) => api.teams.members.remove(teamId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
    },
    onError: (error) => {
      console.error("移除成员失败:", error);
      alert("移除成员失败: " + (error instanceof Error ? error.message : String(error)));
    }
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addMemberMutation.mutate(newMember);
  };

  // Expect memberId as number
  const handleRemoveMember = (memberId: number, memberName: string) => {
    if (window.confirm(`确定要移除成员 ${memberName} 吗？`)) {
      removeMemberMutation.mutate(memberId);
    }
  };

  if (isLoadingTeam || isLoadingMembers) {
    return <div>加载中...</div>;
  }

  if (!team) {
    return <div>团队不存在</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{team.name}</CardTitle>
            <p className="text-sm text-gray-500">{team.description}</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加成员
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新成员</DialogTitle>
                <DialogDescription>
                  通过邮箱添加成员到团队
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="space-y-4">
                {/* Name field removed as we add by email */}
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">角色</Label>
                  <select
                    id="role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'admin' | 'member' })}
                  >
                    <option value="member">成员</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMemberMutation.isPending}>
                    {addMemberMutation.isPending ? '添加中...' : '添加'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(members) && members.map((member) => (
                <TableRow key={member.memberId}> {/* Use memberId as key */}
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role === 'admin' ? '管理员' : '成员'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      // Pass memberId (number) to handler
                      onClick={() => handleRemoveMember(member.memberId, member.name)}
                      // Disable button based on numeric memberId
                      disabled={removeMemberMutation.isPending && removeMemberMutation.variables === member.memberId}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
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