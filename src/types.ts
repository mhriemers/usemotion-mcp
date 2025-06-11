import { z } from "zod";
import {
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
  customFieldSchema,
  motionTaskSchema,
  createTaskSchema,
  createTaskResponseSchema,
  updateTaskSchema,
  moveTaskSchema,
  motionUserSchema,
  motionListUsersResponseSchema,
  motionWorkspaceSchema,
  motionListWorkspacesResponseSchema,
  motionProjectSchema,
  motionListProjectsResponseSchema,
  createProjectSchema,
  motionListTasksResponseSchema,
  scheduleTimeBlockSchema,
  scheduleDetailsSchema,
  motionScheduleSchema,
  motionSchedulesResponseSchema,
  motionStatusSchema,
  motionStatusesResponseSchema,
} from "./schemas.js";

// Custom field types (derived from schemas)
export type CustomFieldText = z.infer<typeof customFieldTextSchema>;
export type CustomFieldNumber = z.infer<typeof customFieldNumberSchema>;
export type CustomFieldUrl = z.infer<typeof customFieldUrlSchema>;
export type CustomFieldDate = z.infer<typeof customFieldDateSchema>;
export type CustomFieldSelect = z.infer<typeof customFieldSelectSchema>;
export type CustomFieldMultiSelect = z.infer<
  typeof customFieldMultiSelectSchema
>;
export type CustomFieldPerson = z.infer<typeof customFieldPersonSchema>;
export type CustomFieldMultiPerson = z.infer<
  typeof customFieldMultiPersonSchema
>;
export type CustomFieldEmail = z.infer<typeof customFieldEmailSchema>;
export type CustomFieldPhone = z.infer<typeof customFieldPhoneSchema>;
export type CustomFieldCheckbox = z.infer<typeof customFieldCheckboxSchema>;
export type CustomFieldRelatedTo = z.infer<typeof customFieldRelatedToSchema>;
export type CustomField = z.infer<typeof customFieldSchema>;

export type MotionTask = z.infer<typeof motionTaskSchema>;

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type CreateTaskResponse = z.infer<typeof createTaskResponseSchema>;

// For update task, we need to omit taskId since it's part of the schema but not the request body
export type UpdateTaskRequest = Omit<
  z.infer<typeof updateTaskSchema>,
  "taskId"
>;
export type UpdateTaskResponse = CreateTaskResponse;
export type GetTaskResponse = CreateTaskResponse;

// For move task, we need to omit taskId since it's part of the schema but not the request body
export type MoveTaskRequest = Omit<z.infer<typeof moveTaskSchema>, "taskId">;
export type MoveTaskResponse = CreateTaskResponse;

export type MotionUser = z.infer<typeof motionUserSchema>;
export type MotionListUsersResponse = z.infer<
  typeof motionListUsersResponseSchema
>;
export type MotionWorkspace = z.infer<typeof motionWorkspaceSchema>;
export type MotionListWorkspacesResponse = z.infer<
  typeof motionListWorkspacesResponseSchema
>;
export type MotionProject = z.infer<typeof motionProjectSchema>;
export type MotionListProjectsResponse = z.infer<
  typeof motionListProjectsResponseSchema
>;
export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type CreateProjectResponse = MotionProject;
export type GetProjectResponse = MotionProject;

export type MotionListTasksResponse = z.infer<
  typeof motionListTasksResponseSchema
>;
export type ScheduleTimeBlock = z.infer<typeof scheduleTimeBlockSchema>;
export type ScheduleDetails = z.infer<typeof scheduleDetailsSchema>;
export type MotionSchedule = z.infer<typeof motionScheduleSchema>;
export type MotionSchedulesResponse = z.infer<
  typeof motionSchedulesResponseSchema
>;
export type MotionStatus = z.infer<typeof motionStatusSchema>;
export type MotionStatusesResponse = z.infer<
  typeof motionStatusesResponseSchema
>;
