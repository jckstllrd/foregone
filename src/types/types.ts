export type Mode = "coach" | "caddie";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
