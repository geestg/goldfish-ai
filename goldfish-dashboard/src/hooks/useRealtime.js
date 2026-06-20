import { useEffect } from "react";
import socket from "../services/socket";

export default function useRealtime({
  onNewData,
  onDeviceStatus
}) {

  useEffect(() => {

    const handleConnect = () => {
      console.log("[SOCKET] Connected");
    };

    const handleDisconnect = () => {
      console.log("[SOCKET] Disconnected");
    };

    const handleReconnect = () => {
      console.log("[SOCKET] Reconnected");
    };

    const handleNewData = (payload) => {
      console.log("[REALTIME][AI]", payload);

      const realtimeData = {
        ...payload,

        created_at:
          payload.created_at ||
          new Date().toISOString(),

        ui_status:
          payload.status || "success",

        highlight: true
      };

      if (onNewData) {
        onNewData(realtimeData);
      }
    };

    const handleDeviceStatus = (payload) => {
      console.log("[REALTIME][DEVICE]", payload);

      if (onDeviceStatus) {
        onDeviceStatus(payload);
      }
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("reconnect", handleReconnect);

    socket.on("new_data", handleNewData);

    socket.on("device_status", handleDeviceStatus);

    return () => {

      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("reconnect", handleReconnect);

      socket.off("new_data", handleNewData);

      socket.off("device_status", handleDeviceStatus);
    };

  }, [onNewData, onDeviceStatus]);
}