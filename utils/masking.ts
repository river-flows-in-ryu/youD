export function nameMasking(text: string): string {
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

export function phoneMasking(text: string): string {
  const parts = text.split("-");

  const [part1, part2, part3] = parts;

  if (part2.length === 3) return `${part1}-***-${part3}`;
  else return `${part1}-****-${part3}`;
}
