import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Issue } from "./Issue";

export enum DefectStatus {
  NEW = "New",
  WORKING = "Working",
  RESOLVED = "Resolved"
}

@Entity()
export class Defect {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({
    type: "simple-enum",
    enum: DefectStatus,
    default: DefectStatus.NEW
  })
  status!: DefectStatus;

  @ManyToOne(() => User, user => user.createdDefects)
  creator!: User;

  @ManyToMany(() => Issue, issue => issue.defects)
  issues!: Issue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
