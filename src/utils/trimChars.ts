export const trimChar = (str: string, char: string, replacement?: string) =>
  trimStartChar(trimEndChar(str, char, replacement), char, replacement);

export const trimStartChar = (str: string, char: string, replacement?: string) => {
  if (!str || !char) return str;
  const regex = new RegExp(`^${char}+`);
  return str.replace(regex, replacement ?? '');
};

export const trimEndChar = (str: string, char: string, replacement?: string) => {
  if (!str || !char) return str;
  const regex = new RegExp(`${char}+$`);
  return str.replace(regex, replacement ?? '');
};
