import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory";
import { MotionMCPServer } from "./motion-mcp-server.js";
import { MotionClient } from "./motion-client.js";
import type {
  CreateProjectRequest,
  CreateTaskRequest,
  MotionProject,
  MotionSchedule,
  MotionStatus,
  MotionTask,
  MotionUser,
  MotionWorkspace,
  MoveTaskRequest,
  UpdateTaskRequest,
} from "./types.js";

// Mock MotionClient
jest.mock("./motion-client.js");

const MockedMotionClient = MotionClient as jest.MockedClass<
  typeof MotionClient
>;

describe("MotionMCPServer", () => {
  let server: MotionMCPServer;
  let client: Client;
  let serverTransport: InMemoryTransport;
  let clientTransport: InMemoryTransport;
  let mockMotionClient: jest.Mocked<MotionClient>;

  // Mock data - enhanced for response types
  const mockTaskResponse = {
    schedulingIssue: false,
    scheduledStart: "2024-01-02T09:00:00Z",
    scheduledEnd: "2024-01-02T10:00:00Z",
    customFieldValues: {},
  };

  const mockTask: MotionTask = {
    id: "task-123",
    name: "Test Task",
    description: "Test task description",
    dueDate: "2024-12-31T23:59:59Z",
    completed: false,
    creator: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    },
    workspace: {
      id: "workspace-1",
      name: "Test Workspace",
    },
    status: {
      id: "status-1",
      name: "In Progress",
      isDefaultStatus: false,
      isResolvedStatus: false,
    },
    priority: "HIGH",
    assignees: [],
    labels: ["test", "urgent"],
    duration: 60,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const mockUser: MotionUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  };

  const mockProject: MotionProject = {
    id: "project-123",
    name: "Test Project",
    description: "Test project description",
    workspaceId: "workspace-1",
    status: {
      name: "Active",
      isDefaultStatus: true,
      isResolvedStatus: false,
    },
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-01-01T00:00:00Z",
  };

  const mockWorkspace: MotionWorkspace = {
    id: "workspace-1",
    name: "Test Workspace",
    teamId: "team-1",
    type: "individual",
    labels: [{ name: "test" }, { name: "urgent" }],
    statuses: [
      {
        name: "To Do",
        isDefaultStatus: true,
        isResolvedStatus: false,
      },
      {
        name: "Done",
        isDefaultStatus: false,
        isResolvedStatus: true,
      },
    ],
  };

  const mockSchedule: MotionSchedule = {
    name: "Default Schedule",
    isDefaultTimezone: true,
    timezone: "America/New_York",
    schedule: {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
    },
  };

  const mockStatus: MotionStatus = {
    name: "In Progress",
    isDefaultStatus: false,
    isResolvedStatus: false,
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock instance with all required methods
    const mockInstance = {
      listTasks: jest.fn(),
      getTask: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      moveTask: jest.fn(),
      unassignTask: jest.fn(),
      deleteTask: jest.fn(),
      getUser: jest.fn(),
      listUsers: jest.fn(),
      listWorkspaces: jest.fn(),
      listProjects: jest.fn(),
      getProject: jest.fn(),
      createProject: jest.fn(),
      getSchedules: jest.fn(),
      getStatuses: jest.fn(),
    } as unknown as jest.Mocked<MotionClient>;

    // Mock the MotionClient constructor to return our mock instance
    MockedMotionClient.mockImplementation(() => mockInstance);
    mockMotionClient = mockInstance;

    // Create linked transport pair
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    // Create server instance
    server = new MotionMCPServer("test-api-key");

    // Create client instance
    client = new Client({
      name: "test-client",
      version: "1.0.0",
    });

    // Connect server and client
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  afterEach(async () => {
    await client.close();
    await serverTransport.close();
    await clientTransport.close();
    jest.clearAllMocks();
  });

  describe("Server initialization", () => {
    it("should create server with correct configuration", () => {
      expect(MockedMotionClient).toHaveBeenCalledWith({
        apiKey: "test-api-key",
      });
    });

    it("should have all tools registered", async () => {
      const toolsResult = await client.listTools();
      const toolNames = toolsResult.tools.map(
        (tool: { name: string }) => tool.name,
      );

      expect(toolNames).toContain("list_motion_tasks");
      expect(toolNames).toContain("get_motion_task");
      expect(toolNames).toContain("create_motion_task");
      expect(toolNames).toContain("update_motion_task");
      expect(toolNames).toContain("move_motion_task");
      expect(toolNames).toContain("unassign_motion_task");
      expect(toolNames).toContain("delete_motion_task");
      expect(toolNames).toContain("get_motion_user");
      expect(toolNames).toContain("list_motion_users");
      expect(toolNames).toContain("list_motion_workspaces");
      expect(toolNames).toContain("list_motion_projects");
      expect(toolNames).toContain("get_motion_project");
      expect(toolNames).toContain("create_motion_project");
      expect(toolNames).toContain("get_motion_schedules");
      expect(toolNames).toContain("get_motion_statuses");
    });
  });

  describe("Task tools", () => {
    describe("list_motion_tasks", () => {
      it("should list tasks without parameters", async () => {
        mockMotionClient.listTasks.mockResolvedValue({
          tasks: [mockTask],
          meta: { pageSize: 1 },
        });

        const result = await client.callTool({
          name: "list_motion_tasks",
          arguments: {},
        });

        expect(mockMotionClient.listTasks).toHaveBeenCalledWith({
          includeAllStatuses: false,
        });
        expect(Array.isArray(result.content)).toBe(true);
        expect(result.content).toHaveLength(1);
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].type).toBe("text");
        expect(content[0].text).toContain("task-123");
      });

      it("should list tasks with filtering parameters", async () => {
        mockMotionClient.listTasks.mockResolvedValue({
          tasks: [mockTask],
          meta: { pageSize: 1 },
        });

        await client.callTool({
          name: "list_motion_tasks",
          arguments: {
            workspaceId: "workspace-1",
            assigneeId: "user-1",
            status: "In Progress",
            label: "urgent",
            name: "Test",
            projectId: "project-1",
            includeAllStatuses: true,
            cursor: "next-page",
          },
        });

        expect(mockMotionClient.listTasks).toHaveBeenCalledWith({
          workspaceId: "workspace-1",
          assigneeId: "user-1",
          status: "In Progress",
          label: "urgent",
          name: "Test",
          projectId: "project-1",
          includeAllStatuses: true,
          cursor: "next-page",
        });
      });

      it("should handle API errors gracefully", async () => {
        mockMotionClient.listTasks.mockRejectedValue(new Error("API Error"));

        const result = await client.callTool({
          name: "list_motion_tasks",
          arguments: {},
        });

        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("Error: API Error");
        expect(result.isError).toBe(true);
      });
    });

    describe("get_motion_task", () => {
      it("should get task by ID", async () => {
        mockMotionClient.getTask.mockResolvedValue({
          ...mockTask,
          ...mockTaskResponse,
        });

        const result = await client.callTool({
          name: "get_motion_task",
          arguments: {
            taskId: "task-123",
          },
        });

        expect(mockMotionClient.getTask).toHaveBeenCalledWith("task-123");
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("task-123");
      });

      it("should handle invalid task ID", async () => {
        mockMotionClient.getTask.mockRejectedValue(new Error("Task not found"));

        const result = await client.callTool({
          name: "get_motion_task",
          arguments: {
            taskId: "invalid-id",
          },
        });

        expect(result.isError).toBe(true);
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("Error: Task not found");
      });
    });

    describe("create_motion_task", () => {
      it("should create task with minimal parameters", async () => {
        const createRequest: CreateTaskRequest = {
          name: "New Task",
          workspaceId: "workspace-1",
        };

        mockMotionClient.createTask.mockResolvedValue({
          ...mockTask,
          ...mockTaskResponse,
        });

        const result = await client.callTool({
          name: "create_motion_task",
          arguments: createRequest as unknown as Record<string, unknown>,
        });

        expect(mockMotionClient.createTask).toHaveBeenCalledWith(createRequest);
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("task-123");
      });

      it("should create task with all parameters", async () => {
        const createRequest: CreateTaskRequest = {
          name: "Complex Task",
          workspaceId: "workspace-1",
          dueDate: "2024-12-31T23:59:59Z",
          duration: 120,
          status: "In Progress",
          autoScheduled: {
            startDate: "2024-01-01T09:00:00Z",
            deadlineType: "HARD",
            schedule: "work-hours",
          },
          projectId: "project-1",
          description: "Detailed description",
          priority: "HIGH",
          labels: ["urgent", "important"],
          assigneeId: "user-1",
        };

        mockMotionClient.createTask.mockResolvedValue({
          ...mockTask,
          ...mockTaskResponse,
        });

        await client.callTool({
          name: "create_motion_task",
          arguments: createRequest as unknown as Record<string, unknown>,
        });

        expect(mockMotionClient.createTask).toHaveBeenCalledWith(createRequest);
      });

      it("should handle validation errors", async () => {
        mockMotionClient.createTask.mockRejectedValue(
          new Error("Validation failed"),
        );

        const result = await client.callTool({
          name: "create_motion_task",
          arguments: {
            name: "Invalid Task",
            workspaceId: "workspace-1",
          },
        });

        expect(result.isError).toBe(true);
      });
    });

    describe("update_motion_task", () => {
      it("should update task", async () => {
        const updateRequest: UpdateTaskRequest = {
          name: "Updated Task Name",
          priority: "LOW",
        };

        mockMotionClient.updateTask.mockResolvedValue({
          ...mockTask,
          ...mockTaskResponse,
        });

        const result = await client.callTool({
          name: "update_motion_task",
          arguments: {
            taskId: "task-123",
            ...updateRequest,
          },
        });

        expect(mockMotionClient.updateTask).toHaveBeenCalledWith(
          "task-123",
          updateRequest,
        );
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("task-123");
      });
    });

    describe("move_motion_task", () => {
      it("should move task to different workspace", async () => {
        const moveRequest: MoveTaskRequest = {
          workspaceId: "workspace-2",
          assigneeId: "user-2",
        };

        mockMotionClient.moveTask.mockResolvedValue({
          ...mockTask,
          ...mockTaskResponse,
        });

        const result = await client.callTool({
          name: "move_motion_task",
          arguments: {
            taskId: "task-123",
            ...moveRequest,
          },
        });

        expect(mockMotionClient.moveTask).toHaveBeenCalledWith(
          "task-123",
          moveRequest,
        );
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("task-123");
      });
    });

    describe("unassign_motion_task", () => {
      it("should unassign task", async () => {
        mockMotionClient.unassignTask.mockResolvedValue(undefined);

        const result = await client.callTool({
          name: "unassign_motion_task",
          arguments: {
            taskId: "task-123",
          },
        });

        expect(mockMotionClient.unassignTask).toHaveBeenCalledWith("task-123");
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("unassigned successfully");
      });
    });

    describe("delete_motion_task", () => {
      it("should delete task", async () => {
        mockMotionClient.deleteTask.mockResolvedValue(undefined);

        const result = await client.callTool({
          name: "delete_motion_task",
          arguments: {
            taskId: "task-123",
          },
        });

        expect(mockMotionClient.deleteTask).toHaveBeenCalledWith("task-123");
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("deleted successfully");
      });
    });
  });

  describe("User tools", () => {
    describe("get_motion_user", () => {
      it("should get current user", async () => {
        mockMotionClient.getUser.mockResolvedValue(mockUser);

        const result = await client.callTool({
          name: "get_motion_user",
          arguments: {},
        });

        expect(mockMotionClient.getUser).toHaveBeenCalled();
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("user-1");
      });
    });

    describe("list_motion_users", () => {
      it("should list users", async () => {
        mockMotionClient.listUsers.mockResolvedValue({
          users: [mockUser],
          meta: { pageSize: 1 },
        });

        const result = await client.callTool({
          name: "list_motion_users",
          arguments: {},
        });

        expect(mockMotionClient.listUsers).toHaveBeenCalledWith({});
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("user-1");
      });

      it("should list users with filtering", async () => {
        mockMotionClient.listUsers.mockResolvedValue({
          users: [mockUser],
          meta: { pageSize: 1 },
        });

        await client.callTool({
          name: "list_motion_users",
          arguments: {
            workspaceId: "workspace-1",
            teamId: "team-1",
            cursor: "next-page",
          },
        });

        expect(mockMotionClient.listUsers).toHaveBeenCalledWith({
          workspaceId: "workspace-1",
          teamId: "team-1",
          cursor: "next-page",
        });
      });
    });
  });

  describe("Workspace tools", () => {
    describe("list_motion_workspaces", () => {
      it("should list workspaces", async () => {
        mockMotionClient.listWorkspaces.mockResolvedValue({
          workspaces: [mockWorkspace],
          meta: { pageSize: 1 },
        });

        const result = await client.callTool({
          name: "list_motion_workspaces",
          arguments: {},
        });

        expect(mockMotionClient.listWorkspaces).toHaveBeenCalledWith({});
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("workspace-1");
      });

      it("should list workspaces with expansion", async () => {
        mockMotionClient.listWorkspaces.mockResolvedValue({
          workspaces: [mockWorkspace],
          meta: { pageSize: 1 },
        });

        const result = await client.callTool({
          name: "list_motion_workspaces",
          arguments: {
            ids: ["workspace-1", "workspace-2"],
            cursor: "next-page",
          },
        });

        expect(mockMotionClient.listWorkspaces).toHaveBeenCalledWith({
          ids: ["workspace-1", "workspace-2"],
          cursor: "next-page",
        });
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("workspace-1");
      });
    });
  });

  describe("Project tools", () => {
    describe("list_motion_projects", () => {
      it("should list projects", async () => {
        mockMotionClient.listProjects.mockResolvedValue({
          projects: [mockProject],
          meta: { pageSize: 1 },
        });

        const result = await client.callTool({
          name: "list_motion_projects",
          arguments: {},
        });

        expect(mockMotionClient.listProjects).toHaveBeenCalledWith({});
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("project-123");
      });
    });

    describe("get_motion_project", () => {
      it("should get project by ID", async () => {
        mockMotionClient.getProject.mockResolvedValue(mockProject);

        const result = await client.callTool({
          name: "get_motion_project",
          arguments: {
            projectId: "project-123",
          },
        });

        expect(mockMotionClient.getProject).toHaveBeenCalledWith("project-123");
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("project-123");
      });
    });

    describe("create_motion_project", () => {
      it("should create project", async () => {
        const createRequest: CreateProjectRequest = {
          name: "New Project",
          workspaceId: "workspace-1",
          description: "Project description",
          priority: "HIGH",
          labels: ["important"],
        };

        mockMotionClient.createProject.mockResolvedValue(mockProject);

        const result = await client.callTool({
          name: "create_motion_project",
          arguments: createRequest as unknown as Record<string, unknown>,
        });

        expect(mockMotionClient.createProject).toHaveBeenCalledWith(
          createRequest,
        );
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("project-123");
      });
    });
  });

  describe("Schedule and Status tools", () => {
    describe("get_motion_schedules", () => {
      it("should get schedules", async () => {
        mockMotionClient.getSchedules.mockResolvedValue([mockSchedule]);

        const result = await client.callTool({
          name: "get_motion_schedules",
          arguments: {},
        });

        expect(mockMotionClient.getSchedules).toHaveBeenCalled();
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("Default Schedule");
      });
    });

    describe("get_motion_statuses", () => {
      it("should get statuses for workspace", async () => {
        mockMotionClient.getStatuses.mockResolvedValue([mockStatus]);

        const result = await client.callTool({
          name: "get_motion_statuses",
          arguments: {
            workspaceId: "workspace-1",
          },
        });

        expect(mockMotionClient.getStatuses).toHaveBeenCalledWith(
          "workspace-1",
        );
        const content = result.content as Array<{ type: string; text: string }>;
        expect(content[0].text).toContain("In Progress");
      });
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      mockMotionClient.listTasks.mockRejectedValue(new Error("Network error"));

      const result = await client.callTool({
        name: "list_motion_tasks",
        arguments: {},
      });

      expect(result.isError).toBe(true);
      const content = result.content as Array<{ type: string; text: string }>;
      expect(content[0].text).toContain("Error: Network error");
    });

    it("should handle unknown errors", async () => {
      mockMotionClient.getUser.mockRejectedValue("Unknown error");

      const result = await client.callTool({
        name: "get_motion_user",
        arguments: {},
      });

      expect(result.isError).toBe(true);
      const content = result.content as Array<{ type: string; text: string }>;
      expect(content[0].text).toContain("Error: Unknown error");
    });

    it("should handle API responses with missing data", async () => {
      mockMotionClient.listTasks.mockResolvedValue({
        tasks: [],
        meta: { pageSize: 0 },
      });

      const result = await client.callTool({
        name: "list_motion_tasks",
        arguments: {},
      });

      const content = result.content as Array<{ type: string; text: string }>;
      expect(content[0].text).toContain("[]");
    });
  });

  describe("Parameter validation", () => {
    it("should validate required parameters", async () => {
      try {
        await client.callTool({
          name: "get_motion_task",
          arguments: {},
        });
      } catch (error) {
        expect((error as Error).message).toContain("taskId");
      }
    });

    it("should validate enum parameters", async () => {
      // This should be caught by Zod validation at the tool level
      mockMotionClient.createTask.mockResolvedValue({
        ...mockTask,
        ...mockTaskResponse,
      });

      await expect(
        client.callTool({
          name: "create_motion_task",
          arguments: {
            name: "Test Task",
            workspaceId: "workspace-1",
            priority: "INVALID_PRIORITY",
          } as unknown as Record<string, unknown>,
        }),
      ).rejects.toThrow(/Invalid enum value/);

      // The tool should not call the client due to validation failure
      expect(mockMotionClient.createTask).not.toHaveBeenCalled();
    });
  });

  describe("Response formatting", () => {
    it("should format successful responses as JSON strings", async () => {
      mockMotionClient.getUser.mockResolvedValue(mockUser);

      const result = await client.callTool({
        name: "get_motion_user",
        arguments: {},
      });

      const content = result.content as Array<{ type: string; text: string }>;
      expect(content[0].type).toBe("text");
      expect(content[0].text).toMatch(/^\{[\s\S]*}$/);

      // Verify it's valid JSON
      const parsed = JSON.parse(content[0].text);
      expect(parsed).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        }),
      );
    });

    it("should format error responses consistently", async () => {
      mockMotionClient.getTask.mockRejectedValue(new Error("Task not found"));

      const result = await client.callTool({
        name: "get_motion_task",
        arguments: {
          taskId: "invalid-id",
        },
      });

      expect(result.isError).toBe(true);
      const content = result.content as Array<{ type: string; text: string }>;
      expect(content[0].type).toBe("text");
      expect(content[0].text).toBe("Error: Task not found");
    });
  });
});
