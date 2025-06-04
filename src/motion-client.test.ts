import { jest } from "@jest/globals";
import { MotionClient } from "./motion-client.js";
import type {
  MotionListTasksResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
  MotionUser,
  MotionListUsersResponse,
  MotionListWorkspacesResponse,
  MotionListProjectsResponse,
  CreateProjectRequest,
  MotionSchedulesResponse,
  MotionStatusesResponse,
} from "./types.js";

describe("MotionClient", () => {
  let client: MotionClient;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    client = new MotionClient({ apiKey: "test-api-key" });
  });

  describe("constructor", () => {
    it("should create a client with the provided config", () => {
      const testClient = new MotionClient({ apiKey: "my-test-key" });
      expect(testClient).toBeInstanceOf(MotionClient);
    });
  });

  describe("makeRequest", () => {
    it("should add required headers to requests", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ test: "data" }), { status: 200 }),
      );

      await client.listTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks",
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-API-Key": "test-api-key",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should throw an error for non-ok responses", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Bad Request", { status: 400, statusText: "Bad Request" }),
      );

      await expect(client.listTasks()).rejects.toThrow(
        "Motion API error: 400 Bad Request\nBad Request",
      );
    });

    it("should parse JSON responses", async () => {
      const responseData = { test: "data" };
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(responseData), { status: 200 }),
      );

      const result = await client.listTasks();
      expect(result).toEqual(responseData);
    });
  });

  describe("listTasks", () => {
    it("should list tasks without parameters", async () => {
      const mockResponse: MotionListTasksResponse = {
        tasks: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.listTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should list tasks with all parameters", async () => {
      const mockResponse: MotionListTasksResponse = {
        tasks: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const params = {
        assigneeId: "user-123",
        cursor: "cursor-456",
        includeAllStatuses: true,
        label: "urgent",
        name: "Test Task",
        projectId: "project-789",
        status: "completed",
        workspaceId: "workspace-101",
      };

      await client.listTasks(params);

      const expectedUrl = new URL("https://api.usemotion.com/v1/tasks");
      expectedUrl.searchParams.append("assigneeId", params.assigneeId);
      expectedUrl.searchParams.append("cursor", params.cursor);
      expectedUrl.searchParams.append("includeAllStatuses", "true");
      expectedUrl.searchParams.append("label", params.label);
      expectedUrl.searchParams.append("name", params.name);
      expectedUrl.searchParams.append("projectId", params.projectId);
      expectedUrl.searchParams.append("status", params.status);
      expectedUrl.searchParams.append("workspaceId", params.workspaceId);

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.any(Object),
      );
    });
  });

  describe("getTask", () => {
    it("should get a task by ID", async () => {
      const mockTask = {
        id: "task-123",
        name: "Test Task",
        status: "active",
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockTask), { status: 200 }),
      );

      const result = await client.getTask("task-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks/task-123",
        expect.any(Object),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      const createRequest: CreateTaskRequest = {
        name: "New Task",
        description: "Task description",
        dueDate: "2024-12-31",
        workspaceId: "workspace-123",
      };

      const mockResponse = {
        id: "new-task-id",
        ...createRequest,
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 201 }),
      );

      const result = await client.createTask(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            "X-API-Key": "test-api-key",
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const updateRequest: UpdateTaskRequest = {
        name: "Updated Task",
        status: "completed",
      };

      const mockResponse = {
        id: "task-123",
        ...updateRequest,
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.updateTask("task-123", updateRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks/task-123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(updateRequest),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("moveTask", () => {
    it("should move a task", async () => {
      const moveRequest: MoveTaskRequest = {
        workspaceId: "workspace-123",
        assigneeId: "user-456",
      };

      const mockResponse = {
        id: "task-123",
        name: "Test Task",
        description: "Task description",
        completed: false,
        creator: {
          id: "creator-123",
          name: "Creator",
          email: "creator@example.com",
        },
        workspace: {
          id: "workspace-123",
          name: "Test Workspace",
        },
        status: {
          id: "status-123",
          name: "In Progress",
          isDefaultStatus: false,
          isResolvedStatus: false,
        },
        priority: "medium",
        assignees: [
          {
            id: "user-456",
            name: "Assignee",
            email: "assignee@example.com",
          },
        ],
        labels: [],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        schedulingIssue: false,
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.moveTask("task-123", moveRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks/task-123/move",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(moveRequest),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

      await client.deleteTask("task-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks/task-123",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("unassignTask", () => {
    it("should unassign a task", async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

      await client.unassignTask("task-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/tasks/task-123/assignee",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("getUser", () => {
    it("should get the current user", async () => {
      const mockUser: MotionUser = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockUser), { status: 200 }),
      );

      const result = await client.getUser();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/users/me",
        expect.any(Object),
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("listUsers", () => {
    it("should list users without parameters", async () => {
      const mockResponse: MotionListUsersResponse = {
        users: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.listUsers();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/users",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should list users with parameters", async () => {
      const mockResponse: MotionListUsersResponse = {
        users: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const params = {
        cursor: "cursor-123",
        teamId: "team-456",
        workspaceId: "workspace-789",
      };

      await client.listUsers(params);

      const expectedUrl = new URL("https://api.usemotion.com/v1/users");
      expectedUrl.searchParams.append("cursor", params.cursor);
      expectedUrl.searchParams.append("teamId", params.teamId);
      expectedUrl.searchParams.append("workspaceId", params.workspaceId);

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.any(Object),
      );
    });
  });

  describe("listWorkspaces", () => {
    it("should list workspaces without parameters", async () => {
      const mockResponse: MotionListWorkspacesResponse = {
        workspaces: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.listWorkspaces();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/workspaces",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should list workspaces with ids parameter", async () => {
      const mockResponse: MotionListWorkspacesResponse = {
        workspaces: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const params = {
        cursor: "cursor-123",
        ids: ["workspace-1", "workspace-2", "workspace-3"],
      };

      await client.listWorkspaces(params);

      const expectedUrl = new URL("https://api.usemotion.com/v1/workspaces");
      expectedUrl.searchParams.append("cursor", params.cursor);
      params.ids.forEach((id) => expectedUrl.searchParams.append("ids", id));

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.any(Object),
      );
    });
  });

  describe("listProjects", () => {
    it("should list projects without parameters", async () => {
      const mockResponse: MotionListProjectsResponse = {
        projects: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.listProjects();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/projects",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should list projects with parameters", async () => {
      const mockResponse: MotionListProjectsResponse = {
        projects: [],
        meta: {
          pageSize: 20,
        },
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const params = {
        cursor: "cursor-123",
        workspaceId: "workspace-456",
      };

      await client.listProjects(params);

      const expectedUrl = new URL("https://api.usemotion.com/v1/projects");
      expectedUrl.searchParams.append("cursor", params.cursor);
      expectedUrl.searchParams.append("workspaceId", params.workspaceId);

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.any(Object),
      );
    });
  });

  describe("getProject", () => {
    it("should get a project by ID", async () => {
      const mockProject = {
        id: "project-123",
        name: "Test Project",
        workspaceId: "workspace-456",
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockProject), { status: 200 }),
      );

      const result = await client.getProject("project-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/projects/project-123",
        expect.any(Object),
      );
      expect(result).toEqual(mockProject);
    });
  });

  describe("createProject", () => {
    it("should create a project", async () => {
      const createRequest: CreateProjectRequest = {
        name: "New Project",
        description: "Project description",
        workspaceId: "workspace-123",
      };

      const mockResponse = {
        id: "new-project-id",
        ...createRequest,
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 201 }),
      );

      const result = await client.createProject(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/projects",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(createRequest),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getSchedules", () => {
    it("should get schedules", async () => {
      const mockResponse: MotionSchedulesResponse = [];

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.getSchedules();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/schedules",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getStatuses", () => {
    it("should get statuses for a workspace", async () => {
      const mockResponse: MotionStatusesResponse = [];

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await client.getStatuses("workspace-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.usemotion.com/v1/statuses?workspaceId=workspace-123",
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("error handling", () => {
    it("should handle 400 errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Invalid request", {
          status: 400,
          statusText: "Bad Request",
        }),
      );

      await expect(client.listTasks()).rejects.toThrow(
        "Motion API error: 400 Bad Request\nInvalid request",
      );
    });

    it("should handle 401 errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        }),
      );

      await expect(client.listTasks()).rejects.toThrow(
        "Motion API error: 401 Unauthorized\nUnauthorized",
      );
    });

    it("should handle 404 errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Not found", { status: 404, statusText: "Not Found" }),
      );

      await expect(client.getTask("non-existent")).rejects.toThrow(
        "Motion API error: 404 Not Found\nNot found",
      );
    });

    it("should handle 500 errors", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("Internal server error", {
          status: 500,
          statusText: "Internal Server Error",
        }),
      );

      await expect(client.listTasks()).rejects.toThrow(
        "Motion API error: 500 Internal Server Error\nInternal server error",
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(client.listTasks()).rejects.toThrow("Network error");
    });
  });
});
