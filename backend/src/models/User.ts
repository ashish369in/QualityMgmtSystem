import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Defect } from "./Defect";
import { Issue } from "./Issue";
import { Task } from "./Task";

export enum UserGroup {
  LINESIDE = "LineSide",
  QUALITY = "Quality",
  OTHERS = "Others"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "simple-enum",
    enum: UserGroup,
    default: UserGroup.OTHERS
  })
  userGroup!: UserGroup;

  @OneToMany(() => Defect, defect => defect.creator)
  createdDefects!: Defect[];

  @OneToMany(() => Issue, issue => issue.creator)
  createdIssues!: Issue[];

  @OneToMany(() => Task, task => task.assignee)
  assignedTasks!: Task[];
}
