"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "@/features/notification/api/notification-api"
import { notificationKeys } from "@/features/notification/hooks/notification-keys"

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationApi.getMyNotification,
    staleTime: 30_000,
  })
}

export function useInvalidateNotifications() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: notificationKeys.all })
}