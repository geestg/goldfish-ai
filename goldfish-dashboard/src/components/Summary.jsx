// SummaryCards.jsx
export default function SummaryCards({ data }) {

  if (!data.length) return null;

  const last = data[data.length - 1];

  return (
    <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>

      <div className="card">
        <h4>Fish Count</h4>
        <h2>{last.num_fish}</h2>
      </div>

      <div className="card">
        <h4>Avg Length</h4>
        <h2>{last.avg_length_cm}</h2>
      </div>

      <div className="card">
        <h4>Feeding</h4>
        <h2>{last.feeding_turns}</h2>
      </div>

    </div>
  );
}