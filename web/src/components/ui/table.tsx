"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TableProps extends React.ComponentProps<"table"> {
  compact?: boolean;
}

function Table({ className, compact = false, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto border border-gray-200 rounded"
      style={{ lineHeight: 1 }}
    >
      <table
        data-slot="table"
        data-compact={compact}
        className={cn("w-full caption-bottom text-sm border-collapse", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-gray-100 [data-compact_&_tr]:border-b-0", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-gray-50", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gray-100 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, children, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-blue-50 data-[state=selected]:bg-blue-100 border-b border-gray-200 transition-colors [data-compact_&]:border-b-[0.5px]",
        className
      )}
      style={{ height: "36px" }}
      {...props}
    >
      {children}
    </tr>
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground px-3 text-left align-middle font-medium whitespace-nowrap border-r border-gray-200 last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [data-compact_&]:px-3 [data-compact_&]:py-0 [data-compact_&]:text-xs [data-compact_&]:font-normal",
        className
      )}
      style={{ height: "36px", padding: "0 12px", lineHeight: 1 }}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap border-r border-gray-200 last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [data-compact_&]:px-3 [data-compact_&]:py-0 [data-compact_&]:text-xs [data-compact_&]:leading-none",
        className
      )}
      style={{ height: "36px", padding: "0 12px", lineHeight: 1 }}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm [data-compact_&]:mt-2 [data-compact_&]:text-xs", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
