import axiosClient from './axiosClient';

export const parcelApi = {
  /**
   * Fetch all cadastral parcels as GeoJSON FeatureCollection
   */
  getParcels: () => axiosClient.get('/parcels'),

  /**
   * Fetch single parcel feature by ULPIN
   */
  getParcelByUlpin: (ulpin) => axiosClient.get(`/parcels/${ulpin}`),
};

export default parcelApi;
