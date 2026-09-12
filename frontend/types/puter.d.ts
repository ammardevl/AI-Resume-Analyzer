interface PuterUser {
  uuid: string;
  username: string;
}

interface FSItem {
  id: string;
  uid: string;
  name: string;
  path: string;
  is_dir: boolean;
  parent_id: string;
  parent_uid: string;
  created: number;
  modified: number;
  accessed: number;
  size: number | null;
  writable: boolean;
}

interface KVItem {
  key: string;
  value: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content:
    | string
    | {
        type: "file" | "text";
        puter_path?: string;
        text?: string;
      }[];
}

interface PuterChatOptions {
  model?: string;
  stream?: boolean;
}

interface AIResponse {
  index: number;
  message: {
    role: string;
    content: string | { type: string; text: string }[];
    refusal: null | string;
    annotations: any[];
  };
  logprobs: null | any;
  finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call";
  usage?: {
    type: string;
    model: string;
    amount: number;
    cost: number;
  }[];
  via_ai_chat_service?: boolean;
}
