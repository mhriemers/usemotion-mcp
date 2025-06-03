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

export interface MoveTaskRequest {
  workspaceId: string;
  assigneeId?: string;
}

export interface MoveTaskResponse extends CreateTaskResponse {}

export interface MotionUser {
  id: string;
  name: string;
  email: string;
}

export interface MotionListUsersResponse {
  users: MotionUser[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}

export interface MotionWorkspace {
  id: string;
  name: string;
  teamId: string;
  type: string;
  labels: Array<{
    name: string;
  }>;
  statuses: Array<{
    name: string;
    isDefaultStatus: boolean;
    isResolvedStatus: boolean;
  }>;
}

export interface MotionListWorkspacesResponse {
  workspaces: MotionWorkspace[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}

export interface MotionProject {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  status: {
    name: string;
    isDefaultStatus: boolean;
    isResolvedStatus: boolean;
  };
  createdTime: string;
  updatedTime: string;
  customFieldValues?: Record<string, any>;
}

export interface MotionListProjectsResponse {
  projects: MotionProject[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}

export interface MotionListTasksResponse {
  tasks: MotionTask[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}