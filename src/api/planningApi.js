import axiosClient from './axiosClient';

export const planningApi = {
  /**
   * Fetch Master Plan zoning and building permissions for a parcel
   */
  getPlanningByUlpin: (ulpin) => axiosClient.get(`/parcels/${ulpin}/planning`),
};

export default planningApi;
