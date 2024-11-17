import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main class="h-screen w-screen flex flex-col justify-center items-center">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
      <A href="/" class="btn-link">
        Home
      </A>
    </main>
  );
}
