export default function masking(text: string): string {
  if (text.length === 2) {
    return text[0] + "*";
  }
  if (text.length === 3) {
    return text[0] + "*" + text[2];
  }
  if (text.length > 3) {
    let masked = text[0] + text[1];
    for (let i = 2; i < text.length; i++) {
      masked += "*";
    }
    masked += text[text.length - 1];
    return masked;
  }
  return text;
}
