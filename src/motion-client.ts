import { z } from "zod";
import {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  GetProjectResponse,
  GetTaskResponse,
  MotionListProjectsResponse,
  MotionListTasksResponse,
  MotionListUsersResponse,
  MotionListWorkspacesResponse,
  MotionSchedulesResponse,
  MotionStatusesResponse,
  MotionUser,
  MoveTaskRequest,
  MoveTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "./types.js";
import {
  listTasksSchema,
  listUsersSchema,
  listWorkspacesSchema,
  listProjectsSchema,
} from "./schemas.js";

const MOTION_API_BASE_URL = "https://api.usemotion.com/v1";

export interface MotionClientConfig {
  apiKey: string;
}

export type ListTasksParams = z.infer<typeof listTasksSchema>;
export type ListUsersParams = z.infer<typeof listUsersSchema>;
export type ListWorkspacesParams = z.infer<typeof listWorkspacesSchema>;
export type ListProjectsParams = z.infer<typeof listProjectsSchema>;

export class MotionClient {
  private config: MotionClientConfig;

  constructor(config: MotionClientConfig) {
    this.config = config;
  }

  async listTasks(
    params: ListTasksParams = {},
  ): Promise<MotionListTasksResponse> {
    const queryParams = new URLSearchParams();

    if (params.assigneeId) queryParams.append("assigneeId", params.assigneeId);
    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.includeAllStatuses !== undefined) {
      queryParams.append(
        "includeAllStatuses",
        params.includeAllStatuses.toString(),
      );
    }
    if (params.label) queryParams.append("label", params.label);
    if (params.name) queryParams.append("name", params.name);
    if (params.projectId) queryParams.append("projectId", params.projectId);
    if (params.status) {
      params.status.forEach(status => queryParams.append("status", status));
    }
    if (params.workspaceId)
      queryParams.append("workspaceId", params.workspaceId);

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

  async updateTask(
    taskId: string,
    params: UpdateTaskRequest,
  ): Promise<UpdateTaskResponse> {
    const endpoint = `/tasks/${taskId}`;
    return this.makeRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(params),
    });
  }

  async moveTask(
    taskId: string,
    params: MoveTaskRequest,
  ): Promise<MoveTaskResponse> {
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

  async listUsers(
    params: ListUsersParams = {},
  ): Promise<MotionListUsersResponse> {
    const queryParams = new URLSearchParams();

    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.teamId) queryParams.append("teamId", params.teamId);
    if (params.workspaceId)
      queryParams.append("workspaceId", params.workspaceId);

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async listWorkspaces(
    params: ListWorkspacesParams = {},
  ): Promise<MotionListWorkspacesResponse> {
    const queryParams = new URLSearchParams();

    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.ids) {
      params.ids.forEach((id) => queryParams.append("ids", id));
    }

    const endpoint = `/workspaces${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async listProjects(
    params: ListProjectsParams = {},
  ): Promise<MotionListProjectsResponse> {
    const queryParams = new URLSearchParams();

    if (params.cursor) queryParams.append("cursor", params.cursor);
    if (params.workspaceId)
      queryParams.append("workspaceId", params.workspaceId);

    const endpoint = `/projects${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  async getProject(projectId: string): Promise<GetProjectResponse> {
    const endpoint = `/projects/${projectId}`;
    return this.makeRequest(endpoint);
  }

  async createProject(
    params: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    const endpoint = "/projects";
    return this.makeRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getSchedules(): Promise<MotionSchedulesResponse> {
    const endpoint = "/schedules";
    return this.makeRequest(endpoint);
  }

  async getStatuses(workspaceId?: string): Promise<MotionStatusesResponse> {
    const queryParams = new URLSearchParams();
    if (workspaceId) {
      queryParams.append("workspaceId", workspaceId);
    }

    const endpoint = `/statuses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.makeRequest(endpoint);
  }

  private async makeRequest<Response>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const url = `${MOTION_API_BASE_URL}${endpoint}`;
    const requestOptions = {
      ...options,
      headers: {
        "X-API-Key": this.config.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    console.error(`[Motion API] ${requestOptions.method || "GET"} ${url}`);
    console.error(
      `[Motion API] Request headers:`,
      JSON.stringify(
        {
          ...requestOptions.headers,
          "X-API-Key": "[REDACTED]",
        },
        null,
        2,
      ),
    );
    if (requestOptions.body) {
      console.error(`[Motion API] Request body:`, requestOptions.body);
    }

    const response = await fetch(url, requestOptions);

    console.error(
      `[Motion API] Response status: ${response.status} ${response.statusText}`,
    );
    console.error(
      `[Motion API] Response headers:`,
      JSON.stringify(Object.fromEntries(response.headers), null, 2),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Motion API] Error response body:`, errorText);
      throw new Error(
        `Motion API error: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    // Check if the response has content (not 204 No Content)
    if (response.status === 204) {
      console.error(`[Motion API] No content response`);
      return undefined as Response;
    }

    const responseData = await response.json();
    console.error(
      `[Motion API] Response body:`,
      JSON.stringify(responseData, null, 2),
    );

    return responseData as Response;
  }
}
