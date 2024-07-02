import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>CrateTime</h1>
        
        <Link href = {"/auth"}>
          <button>Login</button >
        </Link>
      </div>
    </main>
  );
}
