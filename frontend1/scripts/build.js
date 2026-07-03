const { execSync } = require("child_process");
process.env.NODE_OPTIONS = "--openssl-legacy-provider";
process.env.GENERATE_SOURCEMAP = "false";
execSync("npx react-scripts build", { stdio: "inherit" });
