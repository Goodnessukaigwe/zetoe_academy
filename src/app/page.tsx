import Image from "next/image";

export default function Home() {
  return (
    <>
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p>This is the home page of my awesome Next.js application.</p>
      <Image
        src="/images/sample-image.jpg"
        alt="Sample Image"
        width={600}
        height={400}
      />
    </div>
    </>
  );
}
