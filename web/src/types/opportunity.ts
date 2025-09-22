export interface Opportunity {
  id: number;
  companyName: string;
  website: string;
  contactPerson: string;
  contactPhone: string;
  contactWechat: string;
  contactDepartment: string;
  contactPosition: string;
  companySize: string;
  region: string;
  industry: string;
  progress: string;
  status: string;
  description: string;
  ownerId: number;
  teamId: number;
  expectedAmount: string;
  priority: string;
  source: string;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  nextFollowUpAt?: string | null;
  nextFollowUpNote?: string | null;
}

export interface FollowUpRecord {
  id: number;
  type: string;
  content: string;
  result: string;
  nextPlan: string;
  creator: string;
  createTime: string;
}

export interface VoiceNoteMeta {
  actionItems?: string[];
  followUps?: string[];
  sentiment?: string;
  note?: string;
}

export interface VoiceNote {
  id: number;
  filename: string;
  mimeType: string;
  transcript: string | null;
  summary: string | null;
  status: "processing" | "completed" | "failed";
  aiMetadata?: VoiceNoteMeta | null;
  createdAt: string;
}
