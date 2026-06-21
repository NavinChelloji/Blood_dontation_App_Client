import axiosClient from '../app/providers/client';

export const getDonors = async (signal) => {
    return await axiosClient.get('/api/donors', signal);
}

export const getDonorById = async (id, signal) => {
    return await axiosClient.get(`/api/donors/${id}`, signal);
}

export const searchDonors = async (query, signal) => {
    return await axiosClient.get(`/api/donors/search?${query}`, signal);
}