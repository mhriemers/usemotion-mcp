// Custom field types
export type CustomFieldText = { type: "text"; value: string | null };
export type CustomFieldNumber = { type: "number"; value: number | null };
export type CustomFieldUrl = { type: "url"; value: string | null };
export type CustomFieldDate = { type: "date"; value: string | null };
export type CustomFieldSelect = { type: "select"; value: string | null };
export type CustomFieldMultiSelect = { type: "multiSelect"; value: string[] | null };
export type CustomFieldPerson = {
  type: "person";
  value: { id: string; name: string; email: string } | null;
};
export type CustomFieldMultiPerson = {
  type: "multiPerson";
  value: Array<{ id: string; name: string; email: string }> | null;
};
export type CustomFieldEmail = { type: "email"; value: string | null };
export type CustomFieldPhone = { type: "phone"; value: string | null };
export type CustomFieldCheckbox = { type: "checkbox"; value: boolean | null };
export type CustomFieldRelatedTo = { type: "relatedTo"; value: string | null };

export type CustomField =
  | CustomFieldText
  | CustomFieldNumber
  | CustomFieldUrl
  | CustomFieldDate
  | CustomFieldSelect
  | CustomFieldMultiSelect
  | CustomFieldPerson
  | CustomFieldMultiPerson
  | CustomFieldEmail
  | CustomFieldPhone
  | CustomFieldCheckbox
  | CustomFieldRelatedTo;

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
  customFieldValues?: Record<string, CustomField>;
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateTaskResponse extends CreateTaskResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetTaskResponse extends CreateTaskResponse {}

export interface MoveTaskRequest {
  workspaceId: string;
  assigneeId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  customFieldValues?: Record<string, CustomField>;
}

export interface MotionListProjectsResponse {
  projects: MotionProject[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  workspaceId: string;
  dueDate?: string;
  description?: string;
  labels?: string[];
  priority?: string;
  projectDefinitionId?: string;
  stages?: Array<{
    stageDefinitionId: string;
    dueDate: string;
    variableInstances?: Array<{
      variableName: string;
      value: string;
    }>;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateProjectResponse extends MotionProject {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetProjectResponse extends MotionProject {}

export interface MotionListTasksResponse {
  tasks: MotionTask[];
  meta: {
    nextCursor?: string;
    pageSize: number;
  };
}

export interface ScheduleTimeBlock {
  start: string;
  end: string;
}

export interface ScheduleDetails {
  monday?: ScheduleTimeBlock[];
  tuesday?: ScheduleTimeBlock[];
  wednesday?: ScheduleTimeBlock[];
  thursday?: ScheduleTimeBlock[];
  friday?: ScheduleTimeBlock[];
  saturday?: ScheduleTimeBlock[];
  sunday?: ScheduleTimeBlock[];
}

export interface MotionSchedule {
  name: string;
  isDefaultTimezone: boolean;
  timezone: string;
  schedule: ScheduleDetails;
}

export type MotionSchedulesResponse = MotionSchedule[];

export interface MotionStatus {
  name: string;
  isDefaultStatus: boolean;
  isResolvedStatus: boolean;
}

export type MotionStatusesResponse = MotionStatus[];
