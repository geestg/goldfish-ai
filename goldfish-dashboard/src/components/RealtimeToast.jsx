export default function RealtimeToast({
  toast,
  onClose
}) {

  if (!toast) return null;

  return (

    <div
      className="realtime-toast"
      onClick={onClose}
    >

      <div className="toast-title">
        🟢 New Analysis Received
      </div>

      <div className="toast-content">

        <div>
          Fish Count :
          {" "}
          {toast.num_fish}
        </div>

        <div>
          Avg Length :
          {" "}
          {toast.avg_length_cm}
          {" "}cm
        </div>

        <div>
          Feed Turns :
          {" "}
          {toast.feeding_turns}
        </div>

      </div>

    </div>

  );

}