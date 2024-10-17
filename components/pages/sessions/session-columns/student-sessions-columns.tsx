"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Session } from "@/lib/types/session.type"
import { startTimeColumn } from "../columns/start-time-column"
import { durationColumn } from "../columns/duration-column"
import { topicColumn } from "../columns/topic-column"
import { mentorColumn } from "../columns/mentor-column"
import { goalColumn } from "../columns/goal-column"
import { actionColumn } from "../columns/action-column"
import { statusColumn } from "../columns/status-column"

export const studentSessionsColumns: ColumnDef<Session>[] = [
  startTimeColumn,
  durationColumn,
  topicColumn,
  mentorColumn,
  goalColumn,
  statusColumn,
  actionColumn,
]
