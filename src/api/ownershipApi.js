import axiosClient from './axiosClient';

export const ownershipApi = {
  /**
   * Fetch Record of Rights (RoR / 7/12 & 8A / Khatauni / Patta-Chitta) for a parcel
   */
  getRoRByUlpin: (ulpin) => axiosClient.get(`/parcels/${ulpin}/ror`),
};

export default ownershipApi;
