import axios from "axios";

export const API_URL = "http://192.168.137.1:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000
});

export const getHistory = () =>
  api.get("/history");

export const setSchedule = (data) =>
  api.post("/schedule", data);

export const getHealth = () =>
  axios.get(`${API_URL}/health`);

export const getRootStatus = () =>
  axios.get(`${API_URL}/`);

export const getCollection = () =>
  api.get("/collection");

export const getDataset = () =>
  api.get("/dataset");

export const getDatasetFiles = (date) =>
  api.get(`/dataset/${date}`);

export const getDeviceStatus = () =>
  api.get("/device/status");

export const getCameraStatus = () =>
  api.get("/camera/status");

export const getAndroidStatus = () =>
  api.get("/android/status");

/*
 * Sprint #6
 * Live Snapshot Monitor
 */
export const getLiveFrameUrl = () =>
  `${API_URL}/api/camera/latest`;

export const downloadReport = (id) =>
  `${API_URL}/api/report/${id}`;

export const getDatasetZip = (date) =>
  `${API_URL}/api/dataset/export/${date}`;