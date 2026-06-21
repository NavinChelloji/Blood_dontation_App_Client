import axiosClient from "../app/providers/client";

export const getNotifications = async (signal) => {
    return await axiosClient.get('/api/notifications', signal);
}