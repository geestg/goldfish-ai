// CameraView.jsx
export default function CameraView() {

  return (
    <div style={{ marginTop: 20 }}>

      <h3>Live Camera</h3>

      <img
        src="http://192.168.1.140:8000/stream"
        alt="camera"
        style={{ width: 400, borderRadius: 10 }}
      />

    </div>
  );
}