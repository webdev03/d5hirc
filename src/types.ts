export type MessageEvent = {
  nick: string,
  ident: string,
  hostname: string,
  message: string,
  time: Date | undefined,
  reply: (msg: string) => void;
};

export type Module = {
  fn: (ev: MessageEvent) => void;
};
