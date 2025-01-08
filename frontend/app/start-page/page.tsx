export default function Home() {
    return (
      <div style={{ padding: '10px'}}>
        <h1 className="text-2xl font-bold mb-4">Welcome User!</h1>
        <p className="mb-6">Here is a diagram of how this all works:</p>
        <div style={{ paddingLeft: '50px', paddingRight: '50px', paddingTop: '85px' }}>
        <img
          src="/DataProcessingFlowchart.webp"
          alt="Data Processing Flowchart"
          className="max-w-full h-auto"
        />
        </div>
      </div>
    );
  }