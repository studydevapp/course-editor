import {CourseMetadataDto} from './CourseMetadata.dto';
import {TaskType} from '../pages/project/project-tasks/TaskTypes';

export class ProjectTaskDto {
  type: TaskType;
  code: string;
}

export class ProjectInfoDto {
  tasks?: ProjectTaskDto[];
}

export class ProjectDto {

  path: string;

  sdk_version: string;
  key: string;
  metadata: CourseMetadataDto;

  info?: ProjectInfoDto;
}
