import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Issue } from "./Issue";

export enum TaskStatus {
  OPEN = "Open",
  IN_PROGRESS = "InProgress",
  CLOSED = "Closed"
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({
    type: "simple-enum",
    enum: TaskStatus,
    default: TaskStatus.OPEN
  })
  status!: TaskStatus;

  @Column("text", { nullable: true })
  comments!: string;

  @ManyToOne(() => User, user => user.assignedTasks)
  assignee!: User;

  @ManyToOne(() => Issue, issue => issue.tasks)
  issue!: Issue;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
