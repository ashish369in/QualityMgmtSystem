import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Defect } from "./Defect";
import { Task } from "./Task";

export enum IssueStatus {
  OPEN = "Open",
  IN_PROGRESS = "InProgress",
  READY_FOR_CLOSURE = "ReadyForClosure",
  CLOSED = "Closed"
}

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({
    type: "simple-enum",
    enum: IssueStatus,
    default: IssueStatus.OPEN
  })
  status!: IssueStatus;

  @ManyToOne(() => User, user => user.createdIssues)
  creator!: User;

  @ManyToMany(() => Defect, defect => defect.issues)
  @JoinTable()
  defects!: Defect[];

  @OneToMany(() => Task, task => task.issue)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
