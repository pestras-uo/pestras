import { Request } from "express";

export function getIpAddress(req: Request) {
  const ipHeader = req.headers['x-forwarded-for'];

  if (!ipHeader)
    return req.socket.remoteAddress;

  return Array.isArray(ipHeader)
    ? ipHeader[0]
    : ipHeader;

}