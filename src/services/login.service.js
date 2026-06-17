import axiosClient from '../app/providers/client'
export const getOtp = async()=>{
    return await axiosClient.get();

}

export const login = async(payload)=>{
    return await axiosClient.post('/api/auth/login',{...payload});

}
