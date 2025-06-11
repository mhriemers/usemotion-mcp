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
  schedule: z.string().describe("Schedule the task must adhere to. Schedule MUST be 'Work Hours' if scheduling the task for another user"),
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
      "Set values to turn auto scheduling on, set value to null to turn off. The status for the task must have auto scheduling enabled",
    ),
  projectId: idField.optional().describe(
    "The project ID the task should be associated with",
  ),
  description: z
    .string()
    .optional()
    .describe("Github Flavored Markdown for the input"),
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
  name: nameField.describe("Updated title of the task"),
  workspaceId: minLengthIdField.describe(
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
        schedule: z.string().describe("Schedule the task must adhere to. Schedule MUST be 'Work Hours' if scheduling the task for another user"),
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
    .describe("Include all task statuses, cannot be used with status parameter"),
  label: z.string().optional().describe("Filter tasks by label"),
  name: z.string().optional().describe("Case-insensitive task name search"),
  projectId: idField.optional().describe("Limit tasks to a specific project"),
  status: z.array(z.string()).optional().describe("Filter tasks by status array, cannot be used with includeAllStatuses"),
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
    "The workspace to which the project belongs",
  ),
  dueDate: iso8601DateField
    .optional()
    .describe("ISO 8601 due date on the project, like 2024-03-12T10:52:55.714-06:00"),
  description: z
    .string()
    .optional()
    .describe("The description of the project. HTML input accepted"),
  labels: labelsField.optional().describe("The list of labels by name the project should have"),
  priority: priorityEnum.optional().describe("Defaults to MEDIUM. Options are ASAP, HIGH, MEDIUM, and LOW"),
  projectDefinitionId: idField
    .optional()
    .describe("Optional ID of the project definition (template) to use. If provided, the stages array must also be included"),
  stages: z
    .array(
      z.object({
        stageDefinitionId: minLengthIdField.describe(
          "ID of the stage definition",
        ),
        dueDate: iso8601DateField.describe("Due date for this stage"),
        variableInstances: z
          .array(
            z.object({
              variableName: nameField.describe(
                "Name of the variable definition (e.g., the 'role' name being assigned)",
              ),
              value: z.string().describe("The value for the variable (e.g., the user ID if the variable type is 'person')"),
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
      "Optional array of stage objects, required if projectDefinitionId is provided. Stages must match the order and number defined in the project definition",
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
  workspaceId: minLengthIdField.optional().describe(
    "Get statuses for a particular workspace",
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
  isDefaultStatus: z.boolean().optional(), // Optional in some contexts
  isResolvedStatus: z.boolean().optional(), // Optional in some contexts
});

export const motionTaskSchema = z.object({
  id: idField,
  name: z.string(),
  description: z.string(), // HTML contents of the description
  dueDate: z.string().optional(), // datetime
  deadlineType: deadlineTypeEnum, // Values are HARD, SOFT (default) or NONE
  parentRecurringTaskId: z.string().nullable(), // Parent recurring task ID if applicable
  completed: z.boolean(),
  completedTime: z.string().optional(), // datetime
  updatedTime: z.string().optional(), // datetime
  startOn: z.string().optional(), // Date in YYYY-MM-DD format
  creator: motionUserSchema,
  project: z
    .object({
      id: idField,
      name: z.string(),
      description: z.string(), // HTML contents
      workspaceId: idField,
      status: motionStatusSchema.optional(),
      createdTime: z.string().optional(), // datetime
      updatedTime: z.string().optional(), // datetime
      customFieldValues: z.record(z.string(), customFieldSchema).optional(),
    })
    .optional(),
  workspace: z.object({
    id: idField,
    name: z.string(),
    teamId: idField,
    type: z.string(), // team or individual type
    labels: z.array(z.object({ name: z.string() })),
    statuses: z.array(motionStatusSchema),
  }),
  status: motionStatusSchema,
  priority: priorityEnum,
  labels: z.array(z.object({ name: z.string() })), // Array of label objects
  assignees: z.array(motionUserSchema),
  duration: z.union([z.string(), z.number()]).optional(), // Can be string ("NONE", "REMINDER") or number
  scheduledStart: z.string().optional(), // datetime
  createdTime: z.string(), // datetime
  scheduledEnd: z.string().optional(), // datetime
  schedulingIssue: z.boolean(),
  lastInteractedTime: z.string().optional(), // datetime
  customFieldValues: z.record(z.string(), customFieldSchema).optional(),
  chunks: z.array(
    z.object({
      id: z.string(),
      duration: z.number(),
      scheduledStart: z.string(), // datetime
      scheduledEnd: z.string(), // datetime
      completedTime: z.string().optional(), // datetime
      isFixed: z.boolean(),
    })
  ).optional(),
});

// The task response is the same as motionTaskSchema, no extension needed
export const createTaskResponseSchema = motionTaskSchema;

export const motionProjectSchema = z.object({
  id: idField,
  name: z.string(),
  description: z.string(), // HTML contents of the description
  workspaceId: idField,
  status: motionStatusSchema,
  createdTime: z.string().optional(), // datetime, optional in responses
  updatedTime: z.string().optional(), // datetime, optional in responses
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
  start: z.string().describe("When the schedule starts, formatted HH:MM"),
  end: z.string().describe("When the schedule ends, formatted HH:MM"),
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
// Get statuses response returns array of objects with status property
export const motionStatusesResponseSchema = z.array(
  z.object({
    status: motionStatusSchema,
  })
);
