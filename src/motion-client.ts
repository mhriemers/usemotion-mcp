import { 
  MotionListTasksResponse, 
  CreateTaskRequest, 
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  GetTaskResponse,
  MoveTaskRequest,
  MoveTaskResponse,
  MotionUser,
  MotionListUsersResponse,
  MotionListWorkspacesResponse,
  MotionListProjectsResponse,
  GetProjectResponse
} from "./types.js";

const MOTION_API_BASE_URL = "https://api.usemotion.com/v1";

export interface MotionClientConfig {
  apiKey: string;
}

export interface ListTasksParams {
  assigneeId?: string;
  cursor?: string;
  includeAllStatuses?: boolean;
  label?: string;
  name?: string;
  projectId?: string;
  status?: string;
  workspaceId?: string;
}

export interface ListUsersParams {
  cursor?: string;
  teamId?: string;
  workspaceId?: string;
}

export interface ListWorkspacesParams {
  cursor?: string;
  ids?: string[];
}

export interface ListProjectsParams {
  cursor?: string;
  workspaceId?: string;
}

export class MotionClient {
  private config: MotionClientConfig;

  constructor(config: MotionClientConfig) {
    this.config = config;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${MOTION_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-API-Key": this.config.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Motion API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listTasks(params: ListTasksParams = {}): Promise<MotionListTasksResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.assigneeId) queryParams.append("assigneeId", params.assigneeId);
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.includeAllStatuses !== undefined) {
      queryParams.append("includeAllStatuses", params.includeAllStatuses.toString());
    }
    if (params.label) queryParams.append("label", params.label);
    if (params.name) queryParams.append("name", params.name);
    if (params.projectId) queryParams.append("projectId", params.projectId);
    if (params.status) queryParams.append("status", params.status);
    if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

    const endpoint = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async getTask(taskId: string): Promise<GetTaskResponse> {
    const endpoint = `/tasks/${taskId}`;
    return this.makeRequest(endpoint);
  }

  async createTask(params: CreateTaskRequest): Promise<CreateTaskResponse> {
    const endpoint = "/tasks";
    return this.makeRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async updateTask(taskId: string, params: UpdateTaskRequest): Promise<UpdateTaskResponse> {
    const endpoint = `/tasks/${taskId}`;
    return this.makeRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(params),
    });
  }

  async moveTask(taskId: string, params: MoveTaskRequest): Promise<MoveTaskResponse> {
    const endpoint = `/tasks/${taskId}/move`;
    return this.makeRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(params),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const endpoint = `/tasks/${taskId}`;
    await this.makeRequest(endpoint, {
      method: "DELETE",
    });
  }

  async unassignTask(taskId: string): Promise<void> {
    const endpoint = `/tasks/${taskId}/assignee`;
    await this.makeRequest(endpoint, {
      method: "DELETE",
    });
  }

  async getUser(): Promise<MotionUser> {
    const endpoint = "/users/me";
    return this.makeRequest(endpoint);
  }

  async listUsers(params: ListUsersParams = {}): Promise<MotionListUsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.teamId) queryParams.append("teamId", params.teamId);
    if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async listWorkspaces(params: ListWorkspacesParams = {}): Promise<MotionListWorkspacesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.ids) {
      params.ids.forEach(id => queryParams.append("ids", id));
    }

    const endpoint = `/workspaces${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async listProjects(params: ListProjectsParams = {}): Promise<MotionListProjectsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.workspaceId) queryParams.append("workspaceId", params.workspaceId);

    const endpoint = `/projects${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async getProject(projectId: string): Promise<GetProjectResponse> {
    const endpoint = `/projects/${projectId}`;
    return this.makeRequest(endpoint);
  }
}