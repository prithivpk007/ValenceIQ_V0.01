import { mockNotifications } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

class NotificationService {
  constructor() {
    this.notifications = [...mockNotifications];
  }

  async getAll() {
    await mockDelay(100);
    return createApiResponse(this.notifications);
  }

  async markAsRead(id) {
    await mockDelay(50);
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return createApiResponse(this.notifications);
  }

  async markAllAsRead() {
    await mockDelay(50);
    this.notifications.forEach((n) => (n.read = true));
    return createApiResponse(this.notifications);
  }

  async clearAll() {
    await mockDelay(50);
    this.notifications = [];
    return createApiResponse(this.notifications);
  }
}

export const notificationService = new NotificationService();
