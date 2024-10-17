"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { startTimeColumn } from "../columns/start-time-column"
import { durationColumn } from "../columns/duration-column"
import { topicColumn } from "../columns/topic-column"
import { studentColumn } from "../columns/student-column"
import { goalColumn } from "../columns/goal-column"
import { actionColumn } from "../columns/action-column"
import { studentContactColumn } from "../columns/student-contact-column"
import { valueLockedColumn } from "../columns/value-locked-column"
import { statusColumn } from "../columns/status-column"

export const mentorSessionsColumns: ColumnDef<Session>[] = [
  startTimeColumn,
  durationColumn,
  topicColumn,
  studentColumn,
  studentContactColumn,
  goalColumn,
  valueLockedColumn,
  statusColumn,
  actionColumn,
]
