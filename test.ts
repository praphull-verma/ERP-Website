// test.ts

import { signup } from "./src/routes/auth/signup";
import { login } from "./src/routes/auth/login";


async function main() {
  await signup({ name: "Alice", email: "alice@x.com", password: "1234" });
  const result = await login({ email: "alice@x.com", password: "1234" });
  console.log(result);
}

main();