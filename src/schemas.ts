import { z } from "zod";

// ============================================================================
// Task Schemas
// ============================================================================

export const createTaskSchema = z.object({
  name: z.string().min(1).describe("Title of the task"),
  workspaceId: z
    .string()
    .min(1)
    .describe("The workspace ID the task should be associated with"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("ISO 8601 Due date on the task. REQUIRED for scheduled tasks"),
  duration: z
    .union([
      z.literal("NONE"),
      z.literal("REMINDER"),
      z.coerce.number().int().positive(),
    ])
    .optional()
    .describe(
      "Duration can be 'NONE', 'REMINDER', or an integer greater than 0 (representing minutes)",
    ),
  status: z
    .string()
    .optional()
    .describe("Task status"),
  autoScheduled: z
    .union([
      z.object({
        startDate: z
          .string()
          .datetime({ offset: true })
          .describe(
            "ISO 8601 Date which is trimmed to the start of the day passed",
          ),
        deadlineType: z
          .enum(["HARD", "SOFT", "NONE"])
          .describe("HARD, SOFT, or NONE"),
        schedule: z
          .string()
          .describe("Schedule the task must adhere to"),
      }),
      z.null(),
    ])
    .optional()
    .describe(
      "Set values to turn auto scheduling on, set value to null to turn off",
    ),
  projectId: z
    .string()
    .optional()
    .describe("The project ID the task should be associated with"),
  description: z
    .string()
    .optional()
    .describe("Github Flavored Markdown for the description"),
  priority: z
    .enum(["ASAP", "HIGH", "MEDIUM", "LOW"])
    .optional()
    .describe("ASAP, HIGH, MEDIUM, or LOW"),
  labels: z
    .array(z.string().min(1))
    .optional()
    .describe("The names of the labels to be added to the task"),
  assigneeId: z
    .string()
    .optional()
    .describe("The user id the task should be assigned to"),
});

export const updateTaskSchema = z.object({
  taskId: z.string().min(1).describe("The ID of the task to update"),
  name: z.string().min(1).optional().describe("Updated title of the task"),
  workspaceId: z
    .string()
    .min(1)
    .optional()
    .describe("Updated workspace ID for the task"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("Updated ISO 8601 due date. REQUIRED for scheduled tasks"),
  duration: z
    .union([
      z.literal("NONE"),
      z.literal("REMINDER"),
      z.coerce.number().int().positive(),
    ])
    .optional()
    .describe("Updated duration: 'NONE', 'REMINDER', or minutes as a number"),
  status: z.string().optional().describe("Updated task status"),
  autoScheduled: z
    .union([
      z.object({
        startDate: z
          .string()
          .datetime({ offset: true })
          .describe("ISO 8601 Date for scheduling start"),
        deadlineType: z
          .enum(["HARD", "SOFT", "NONE"])
          .describe("HARD, SOFT, or NONE"),
        schedule: z
          .string()
          .describe("Schedule name"),
      }),
      z.null(),
    ])
    .optional()
    .describe("Updated auto-scheduling settings or null to disable"),
  projectId: z.string().optional().describe("Updated project ID for the task"),
  description: z
    .string()
    .optional()
    .describe("Updated description in GitHub Flavored Markdown"),
  priority: z
    .enum(["ASAP", "HIGH", "MEDIUM", "LOW"])
    .optional()
    .describe("Updated priority: ASAP, HIGH, MEDIUM, or LOW"),
  labels: z
    .array(z.string().min(1))
    .optional()
    .describe("Updated list of label names for the task"),
  assigneeId: z.string().optional().describe("Updated assignee user ID"),
});

export const moveTaskSchema = z.object({
  taskId: z.string().min(1).describe("The ID of the task to move"),
  workspaceId: z
    .string()
    .min(1)
    .describe("The ID of the workspace to move the task to"),
  assigneeId: z
    .string()
    .optional()
    .describe(
      "Optional: The user ID to assign the task to in the new workspace",
    ),
});

export const listTasksSchema = z.object({
  assigneeId: z
    .string()
    .optional()
    .describe("Limit tasks to a specific assignee"),
  cursor: z.string().optional().describe("Pagination cursor for next page"),
  includeAllStatuses: z.coerce
    .boolean()
    .optional()
    .describe("Include all task statuses"),
  label: z.string().optional().describe("Filter tasks by label"),
  name: z.string().optional().describe("Case-insensitive task name search"),
  projectId: z
    .string()
    .optional()
    .describe("Limit tasks to a specific project"),
  status: z.string().optional().describe("Filter tasks by status"),
  workspaceId: z.string().optional().describe("Specify workspace for tasks"),
});

export const getTaskSchema = z.object({
  taskId: z.string().min(1).describe("The ID of the task to retrieve"),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().min(1).describe("The ID of the task to delete"),
});

export const unassignTaskSchema = z.object({
  taskId: z.string().min(1).describe("The ID of the task to unassign"),
});

// ============================================================================
// Project Schemas
// ============================================================================

export const createProjectSchema = z.object({
  name: z.string().min(1).describe("The name of the project"),
  workspaceId: z
    .string()
    .min(1)
    .describe("The workspace ID where the project should be created"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("ISO 8601 due date for the project"),
  description: z
    .string()
    .optional()
    .describe("The description of the project (HTML input accepted)"),
  labels: z
    .array(z.string().min(1))
    .optional()
    .describe("Array of label names for the project"),
  priority: z
    .enum(["ASAP", "HIGH", "MEDIUM", "LOW"])
    .optional()
    .describe("Project priority"),
  projectDefinitionId: z
    .string()
    .optional()
    .describe("Optional ID of the project definition (template) to use"),
  stages: z
    .array(
      z.object({
        stageDefinitionId: z
          .string()
          .min(1)
          .describe("ID of the stage definition"),
        dueDate: z
          .string()
          .datetime({ offset: true })
          .describe("Due date for this stage (ISO 8601)"),
        variableInstances: z
          .array(
            z.object({
              variableName: z
                .string()
                .min(1)
                .describe("Name of the variable definition"),
              value: z.string().describe("The value for the variable"),
            }),
          )
          .optional()
          .describe(
            "Optional array to assign values to variables specific to this stage",
          ),
      }),
    )
    .optional()
    .describe(
      "Optional array of stage objects (required if projectDefinitionId is provided)",
    ),
});

export const listProjectsSchema = z.object({
  cursor: z.string().optional().describe("Pagination cursor for next page"),
  workspaceId: z
    .string()
    .optional()
    .describe("Filter projects by workspace ID"),
});

export const getProjectSchema = z.object({
  projectId: z.string().min(1).describe("The ID of the project to retrieve"),
});

// ============================================================================
// User Schemas
// ============================================================================

export const listUsersSchema = z.object({
  cursor: z.string().optional().describe("Pagination cursor for next page"),
  teamId: z.string().optional().describe("Filter users by team ID"),
  workspaceId: z.string().optional().describe("Filter users by workspace ID"),
});

// ============================================================================
// Workspace Schemas
// ============================================================================

export const listWorkspacesSchema = z.object({
  cursor: z.string().optional().describe("Pagination cursor for next page"),
  ids: z
    .array(z.string().min(1))
    .optional()
    .describe("Expand details of specific workspace IDs"),
});

// ============================================================================
// Schedule & Status Schemas
// ============================================================================

export const getStatusesSchema = z.object({
  workspaceId: z
    .string()
    .min(1)
    .describe("The workspace ID to get statuses for"),
});

// ============================================================================
// Custom Field Schemas (for responses)
// ============================================================================

export const customFieldTextSchema = z.object({
  type: z.literal("text"),
  value: z.string().nullable(),
});

export const customFieldNumberSchema = z.object({
  type: z.literal("number"),
  value: z.number().nullable(),
});

export const customFieldUrlSchema = z.object({
  type: z.literal("url"),
  value: z.string().nullable(),
});

export const customFieldDateSchema = z.object({
  type: z.literal("date"),
  value: z.string().nullable(),
});

export const customFieldSelectSchema = z.object({
  type: z.literal("select"),
  value: z.string().nullable(),
});

export const customFieldMultiSelectSchema = z.object({
  type: z.literal("multiSelect"),
  value: z.array(z.string()).nullable(),
});

export const customFieldPersonSchema = z.object({
  type: z.literal("person"),
  value: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable(),
});

export const customFieldMultiPersonSchema = z.object({
  type: z.literal("multiPerson"),
  value: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .nullable(),
});

export const customFieldEmailSchema = z.object({
  type: z.literal("email"),
  value: z.string().nullable(),
});

export const customFieldPhoneSchema = z.object({
  type: z.literal("phone"),
  value: z.string().nullable(),
});

export const customFieldCheckboxSchema = z.object({
  type: z.literal("checkbox"),
  value: z.boolean().nullable(),
});

export const customFieldRelatedToSchema = z.object({
  type: z.literal("relatedTo"),
  value: z.string().nullable(),
});

export const customFieldSchema = z.union([
  customFieldTextSchema,
  customFieldNumberSchema,
  customFieldUrlSchema,
  customFieldDateSchema,
  customFieldSelectSchema,
  customFieldMultiSelectSchema,
  customFieldPersonSchema,
  customFieldMultiPersonSchema,
  customFieldEmailSchema,
  customFieldPhoneSchema,
  customFieldCheckboxSchema,
  customFieldRelatedToSchema,
]);

// ============================================================================
// Response Schemas
// ============================================================================

export const motionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const motionStatusSchema = z.object({
  id: z.string().optional(), // Some endpoints include ID, others don't
  name: z.string(),
  isDefaultStatus: z.boolean(),
  isResolvedStatus: z.boolean(),
});

export const motionTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean(),
  creator: motionUserSchema,
  project: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  workspace: z.object({
    id: z.string(),
    name: z.string(),
  }),
  status: motionStatusSchema,
  priority: z.string(),
  assignees: z.array(motionUserSchema),
  labels: z.array(z.string()),
  duration: z.number().optional(),
  autoScheduled: z
    .object({
      startDate: z.string(),
      deadlineType: z.string(),
      schedule: z.string(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskResponseSchema = motionTaskSchema.extend({
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  schedulingIssue: z.boolean(),
  customFieldValues: z.record(z.string(), customFieldSchema).optional(),
});

export const motionProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  workspaceId: z.string(),
  status: motionStatusSchema,
  createdTime: z.string(),
  updatedTime: z.string(),
  customFieldValues: z.record(z.string(), customFieldSchema).optional(),
});

export const motionWorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  teamId: z.string(),
  type: z.string(),
  labels: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  statuses: z.array(motionStatusSchema),
});

export const scheduleTimeBlockSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const scheduleDetailsSchema = z.object({
  monday: z.array(scheduleTimeBlockSchema).optional(),
  tuesday: z.array(scheduleTimeBlockSchema).optional(),
  wednesday: z.array(scheduleTimeBlockSchema).optional(),
  thursday: z.array(scheduleTimeBlockSchema).optional(),
  friday: z.array(scheduleTimeBlockSchema).optional(),
  saturday: z.array(scheduleTimeBlockSchema).optional(),
  sunday: z.array(scheduleTimeBlockSchema).optional(),
});

export const motionScheduleSchema = z.object({
  name: z.string(),
  isDefaultTimezone: z.boolean(),
  timezone: z.string(),
  schedule: scheduleDetailsSchema,
});

// List response schemas
export const motionListTasksResponseSchema = z.object({
  tasks: z.array(motionTaskSchema),
  meta: z.object({
    nextCursor: z.string().optional(),
    pageSize: z.number(),
  }),
});

export const motionListUsersResponseSchema = z.object({
  users: z.array(motionUserSchema),
  meta: z.object({
    nextCursor: z.string().optional(),
    pageSize: z.number(),
  }),
});

export const motionListWorkspacesResponseSchema = z.object({
  workspaces: z.array(motionWorkspaceSchema),
  meta: z.object({
    nextCursor: z.string().optional(),
    pageSize: z.number(),
  }),
});

export const motionListProjectsResponseSchema = z.object({
  projects: z.array(motionProjectSchema),
  meta: z.object({
    nextCursor: z.string().optional(),
    pageSize: z.number(),
  }),
});

export const motionSchedulesResponseSchema = z.array(motionScheduleSchema);
export const motionStatusesResponseSchema = z.array(motionStatusSchema);
