export default function Home() {
    return (
      <div style={{ padding: '10px'}}>
        <h1 className="text-2xl font-bold mb-4">Welcome User!</h1>
        <p className="mb-6">Here is a diagram of how this all works:</p>
        <div style={{ paddingLeft: '100px', paddingTop: '85px' }}>
        <img
          src="/welcome-user.png"
          alt="Data Processing Flowchart"
          className="max-w-full h-auto"
        />
        </div>
      </div>
    );
  }