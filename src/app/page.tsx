import dynamic from "next/dynamic";

const Meeting = dynamic(() => import("./Meeting"), { ssr: false });

const Page = () => (
  <div>
    {/* <h1>Meeting Page</h1> */}
    <Meeting />
  </div>
);

export default Page;
