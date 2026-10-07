import { initBotId } from "botid/client/core";

// BotID (module 12): runs an invisible challenge in the browser and attaches
// the result to requests for the paths listed here. The server then calls
// checkBotId() to decide if the caller is a human.
initBotId({
  protect: [{ path: "/api/security/protected", method: "POST" }],
});
