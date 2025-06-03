export interface MotionTask {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  status: {
    id: string;
    name: string;
    isDefaultStatus: boolean;
    isResolvedStatus: boolean;
  };
  priority: string;
  assignees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  labels: string[];
  duration?: number;
  autoScheduled?: {
    startDate: string;
    deadlineType: string;
    schedule: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  name: string;
  workspaceId: string;
  dueDate?: string;
  duration?: string | number;
  status?: string;
  autoScheduled?: {
    startDate: string;
    deadlineType?: string;
    schedule?: string;
  } | null;
  projectId?: string;
  description?: string;
  priority?: string;
  labels?: string[];
  assigneeId?: string;
}

export interface CreateTaskResponse extends MotionTask {
  scheduledStart?: string;
  scheduledEnd?: string;
  schedulingIssue: boolean;
  customFieldValues?: Record<string, any>;
}

export interface UpdateTaskRequest {
  name?: string;
  workspaceId?: string;
  dueDate?: string;
  duration?: string | number;
  status?: string;
  autoScheduled?: {
    startDate: string;
    deadlineType?: string;
    schedule?: string;
  } | null;
  projectId?: string;
  description?: string;
  priority?: string;
  labels?: string[];
  assigneeId?: string;
}

export interface UpdateTaskResponse extends CreateTaskResponse {}

export interface GetTaskResponse extends CreateTaskResponse {}

export interface MotionListTasksResponse {
  tasks: MotionTask[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}