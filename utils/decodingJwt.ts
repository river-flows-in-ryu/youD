import base64 from "base-64";

export default function decodingJwttsx(jwtCode: string | undefined) {
  if (jwtCode) {
    let payload = jwtCode.substring(
      jwtCode.indexOf(".") + 1,
      jwtCode.lastIndexOf(".")
    );
    let decodingInfo = base64.decode(payload);
    let decodingInfoJson = JSON.parse(decodingInfo);

    return decodingInfoJson;
  }
}
