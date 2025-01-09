import { redirect } from 'next/navigation'

export default function Home() {

  redirect(`/login`)
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li>
            Hilti
          </li>
          <li>Project</li>
          <li> Seminar</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div> Demo text </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div> item 1 </div>
        <div> item 2 </div>
        <div> item 3</div>
      </footer>
    </div>
  );
}
