import { get } from "svelte/store";
import { MRM_BACKEND_URL } from "../constants";
import { botId } from "../../stores/home";

type RootInfoResponse = {
  mixin_app_id?: string;
};

let initBotIdPromise: Promise<string | null> | null = null;

export const initBotId = (): Promise<string | null> => {
  if (initBotIdPromise) return initBotIdPromise;

  initBotIdPromise = (async () => {
    const existingBotId = get(botId);
    if (existingBotId) return existingBotId;

    try {
      const response = await fetch(`${MRM_BACKEND_URL}/`);
      const data = (await response.json()) as RootInfoResponse;

      if (
        typeof data.mixin_app_id === "string" &&
        data.mixin_app_id.length > 0
      ) {
        botId.set(data.mixin_app_id);
        return data.mixin_app_id;
      }
    } catch (error) {
      console.error("Error fetching bot id:", error);
    }

    return null;
  })();

  return initBotIdPromise;
};
