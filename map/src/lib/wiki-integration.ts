// Probably dumb, might replace later
export type WikiData = {
  url: string;
  /** e.g. weapons */
  category: string;
  /** Sub category e.g. straight-swords */
  group: string;
  /** e.g. blade of valor */
  name: string;
};

/**
 * Converts wiki urls to usable data.
 *
 * @example
 * parseWikiLink('https://convergencemod.com/weapons/straight-swords/blade-of-valor')
 * // {
 * //   category: "weapons",
 * //   group: "straight-swords",
 * //   name: "blade-of-valor"
 * // }
 */
export function parseWikiLink(_url: string): WikiData {
  if (!_url.includes("convergencemod"))
    throw Error("Not a convergencemod.com url");

  const url = new URL(_url);

  const segments = url.pathname.split("/");

  return {
    url: _url,
    category: segments[1].toLowerCase(),
    group: segments[2].toLowerCase(),
    name: segments[3].toLowerCase(),
  };
}
