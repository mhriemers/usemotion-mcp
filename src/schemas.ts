import { z } from "zod";

// ============================================================================
// Common Field Schemas
// ============================================================================

// Priority enum used across tasks and projects
export const priorityEnum = z.enum(["ASAP", "HIGH", "MEDIUM", "LOW"]);

// Deadline type enum
export const deadlineTypeEnum = z.enum(["HARD", "SOFT", "NONE"]);

// Duration type
export const durationType = z.union([
  z.literal("NONE"),
  z.literal("REMINDER"),
  z.coerce.number().int().positive(),
]);

// Common ID fields
export const idField = z.string();
export const minLengthIdField = z.string().min(1);

// Common timestamp fields
export const iso8601DateField = z.string().datetime({ offset: true });

// Common name field
export const nameField = z.string().min(1);

// Labels field
export const labelsField = z.array(z.string().min(1));

// Cursor field for pagination
export const cursorField = z.string().optional().describe("Pagination cursor for next page");

// Person schema used in multiple places
export const personSchema = z.object({
  id: idField,
  name: z.string(),
  email: z.string(),
});

// Auto scheduling schema
export const autoScheduledSchema = z.object({
  startDate: iso8601DateField.describe(
    "ISO 8601 Date which is trimmed to the start of the day passed",
  ),
  deadlineType: deadlineTypeEnum.describe("HARD, SOFT, or NONE"),
  schedule: z.string().describe("Schedule the task must adhere to"),
});

// Pagination meta schema
export const paginationMetaSchema = z.object({
  nextCursor: z.string().optional(),
  pageSize: z.number(),
});

// ============================================================================
// Task Schemas
// ============================================================================

export const createTaskSchema = z.object({
  name: nameField.describe("Title of the task"),
  workspaceId: minLengthIdField.describe(
    "The workspace ID the task should be associated with",
  ),
  dueDate: iso8601DateField
    .optional()
    .describe("ISO 8601 Due date on the task. REQUIRED for scheduled tasks"),
  duration: durationType
    .optional()
    .describe(
      "Duration can be 'NONE', 'REMINDER', or an integer greater than 0 (representing minutes)",
    ),
  status: z.string().optional().describe("Task status"),
  autoScheduled: z
    .union([autoScheduledSchema, z.null()])
    .optional()
    .describe(
      "Set values to turn auto scheduling on, set value to null to turn off",
    ),
  projectId: idField.optional().describe(
    "The project ID the task should be associated with",
  ),
  description: z
    .string()
    .optional()
    .describe("Github Flavored Markdown for the description"),
  priority: priorityEnum.optional().describe("ASAP, HIGH, MEDIUM, or LOW"),
  labels: labelsField.optional().describe(
    "The names of the labels to be added to the task",
  ),
  assigneeId: idField.optional().describe(
    "The user id the task should be assigned to",
  ),
});

export const updateTaskSchema = z.object({
  taskId: minLengthIdField.describe("The ID of the task to update"),
  name: nameField.optional().describe("Updated title of the task"),
  workspaceId: minLengthIdField.optional().describe(
    "Updated workspace ID for the task",
  ),
  dueDate: iso8601DateField
    .optional()
    .describe("Updated ISO 8601 due date. REQUIRED for scheduled tasks"),
  duration: durationType
    .optional()
    .describe("Updated duration: 'NONE', 'REMINDER', or minutes as a number"),
  status: z.string().optional().describe("Updated task status"),
  autoScheduled: z
    .union([
      z.object({
        startDate: iso8601DateField.describe("ISO 8601 Date for scheduling start"),
        deadlineType: deadlineTypeEnum.describe("HARD, SOFT, or NONE"),
        schedule: z.string().describe("Schedule name"),
      }),
      z.null(),
    ])
    .optional()
    .describe("Updated auto-scheduling settings or null to disable"),
  projectId: idField.optional().describe("Updated project ID for the task"),
  description: z
    .string()
    .optional()
    .describe("Updated description in GitHub Flavored Markdown"),
  priority: priorityEnum
    .optional()
    .describe("Updated priority: ASAP, HIGH, MEDIUM, or LOW"),
  labels: labelsField.optional().describe(
    "Updated list of label names for the task",
  ),
  assigneeId: idField.optional().describe("Updated assignee user ID"),
});

export const moveTaskSchema = z.object({
  taskId: minLengthIdField.describe("The ID of the task to move"),
  workspaceId: minLengthIdField.describe(
    "The ID of the workspace to move the task to",
  ),
  assigneeId: idField
    .optional()
    .describe(
      "Optional: The user ID to assign the task to in the new workspace",
    ),
});

export const listTasksSchema = z.object({
  assigneeId: idField.optional().describe("Limit tasks to a specific assignee"),
  cursor: cursorField,
  includeAllStatuses: z.coerce
    .boolean()
    .optional()
    .describe("Include all task statuses"),
  label: z.string().optional().describe("Filter tasks by label"),
  name: z.string().optional().describe("Case-insensitive task name search"),
  projectId: idField.optional().describe("Limit tasks to a specific project"),
  status: z.string().optional().describe("Filter tasks by status"),
  workspaceId: idField.optional().describe("Specify workspace for tasks"),
});

export const getTaskSchema = z.object({
  taskId: minLengthIdField.describe("The ID of the task to retrieve"),
});

export const deleteTaskSchema = z.object({
  taskId: minLengthIdField.describe("The ID of the task to delete"),
});

export const unassignTaskSchema = z.object({
  taskId: minLengthIdField.describe("The ID of the task to unassign"),
});

// ============================================================================
// Project Schemas
// ============================================================================

export const createProjectSchema = z.object({
  name: nameField.describe("The name of the project"),
  workspaceId: minLengthIdField.describe(
    "The workspace ID where the project should be created",
  ),
  dueDate: iso8601DateField
    .optional()
    .describe("ISO 8601 due date for the project"),
  description: z
    .string()
    .optional()
    .describe("The description of the project (HTML input accepted)"),
  labels: labelsField.optional().describe("Array of label names for the project"),
  priority: priorityEnum.optional().describe("Project priority"),
  projectDefinitionId: idField
    .optional()
    .describe("Optional ID of the project definition (template) to use"),
  stages: z
    .array(
      z.object({
        stageDefinitionId: minLengthIdField.describe(
          "ID of the stage definition",
        ),
        dueDate: iso8601DateField.describe("Due date for this stage (ISO 8601)"),
        variableInstances: z
          .array(
            z.object({
              variableName: nameField.describe(
                "Name of the variable definition",
              ),
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
  cursor: cursorField,
  workspaceId: idField.optional().describe("Filter projects by workspace ID"),
});

export const getProjectSchema = z.object({
  projectId: minLengthIdField.describe("The ID of the project to retrieve"),
});

// ============================================================================
// User Schemas
// ============================================================================

export const listUsersSchema = z.object({
  cursor: cursorField,
  teamId: idField.optional().describe("Filter users by team ID"),
  workspaceId: idField.optional().describe("Filter users by workspace ID"),
});

// ============================================================================
// Workspace Schemas
// ============================================================================

export const listWorkspacesSchema = z.object({
  cursor: cursorField,
  ids: z
    .array(minLengthIdField)
    .optional()
    .describe("Expand details of specific workspace IDs"),
});

// ============================================================================
// Schedule & Status Schemas
// ============================================================================

export const getStatusesSchema = z.object({
  workspaceId: minLengthIdField.describe(
    "The workspace ID to get statuses for",
  ),
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
  value: personSchema.nullable(),
});

export const customFieldMultiPersonSchema = z.object({
  type: z.literal("multiPerson"),
  value: z.array(personSchema).nullable(),
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

export const motionUserSchema = personSchema;

export const motionStatusSchema = z.object({
  id: z.string().optional(), // Some endpoints include ID, others don't
  name: z.string(),
  isDefaultStatus: z.boolean(),
  isResolvedStatus: z.boolean(),
});

export const motionTaskSchema = z.object({
  id: idField,
  name: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean(),
  creator: motionUserSchema,
  project: z
    .object({
      id: idField,
      name: z.string(),
    })
    .optional(),
  workspace: z.object({
    id: idField,
    name: z.string(),
  }),
  status: motionStatusSchema,
  priority: priorityEnum,
  assignees: z.array(motionUserSchema),
  labels: z.array(z.string()),
  duration: z.number().optional(),
  autoScheduled: z
    .object({
      startDate: z.string(),
      deadlineType: deadlineTypeEnum,
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
  id: idField,
  name: z.string(),
  description: z.string(),
  workspaceId: idField,
  status: motionStatusSchema,
  createdTime: z.string(),
  updatedTime: z.string(),
  customFieldValues: z.record(z.string(), customFieldSchema).optional(),
});

export const motionWorkspaceSchema = z.object({
  id: idField,
  name: z.string(),
  teamId: idField,
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
  meta: paginationMetaSchema,
});

export const motionListUsersResponseSchema = z.object({
  users: z.array(motionUserSchema),
  meta: paginationMetaSchema,
});

export const motionListWorkspacesResponseSchema = z.object({
  workspaces: z.array(motionWorkspaceSchema),
  meta: paginationMetaSchema,
});

export const motionListProjectsResponseSchema = z.object({
  projects: z.array(motionProjectSchema),
  meta: paginationMetaSchema,
});

export const motionSchedulesResponseSchema = z.array(motionScheduleSchema);
export const motionStatusesResponseSchema = z.array(motionStatusSchema);
