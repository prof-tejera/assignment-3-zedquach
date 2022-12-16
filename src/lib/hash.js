import zlib from "react-zlib-js";
import { Buffer } from "buffer";

export async function encode(message) {
  const b = Buffer.from(message);
  const compressed = zlib.deflateSync(b).toString("base64");
  return compressed;
}

export async function decode(message) {
  var b = new Buffer(message, "base64");
  var result = zlib.inflateSync(b).toString("utf-8");
  return result;
}
