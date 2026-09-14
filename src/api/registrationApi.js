import axiosClient from './axiosClient';

export const registrationApi = {
  /**
   * Fetch deed and encumbrance records for a parcel
   */
  getRegistrationByUlpin: (ulpin) => axiosClient.get(`/parcels/${ulpin}/registration`),
};

export default registrationApi;
