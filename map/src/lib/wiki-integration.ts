import { WIKI_BASEURL } from "./constants";

export function itemLink(category: string, name: string) {
  switch (category) {
    case "Armor":
      return `${WIKI_BASEURL}/equipment/armor/${name}`;
    default:
      return `${WIKI_BASEURL}/${category}/${name}`;
  }
}

// const categories = [
//   "Armor",
//   "Key Item",
//   "Weapons/Light-Bows",
//   "Spirit Summon",
//   "Weapons/Curved-Swords",
//   "Ash of War",
//   "Weapons/Medium-Shields",
//   "Item",
//   "Weapons/Great-Hammers",
//   "Weapons/Greatshields",
//   "Weapons/Claws",
//   "Weapons/Crossbows",
//   "Weapons/Axes",
//   "Weapons/Hammers",
//   "Weapons/Halberds",
//   "Weapons/Straight-Swords",
//   "Weapons/Greatswords",
//   "Weapons/Spears",
//   "Weapons/Daggers",
//   "Remnant",
//   "Weapons/Great-Katanas",
//   "Weapons/Bows",
//   "Weapons/Twinblades",
//   "Weapons/Seals",
//   "Weapons/Scythes",
//   "Weapons/Fists",
//   "Spell Rune",
//   "Weapons/Thrusting-Swords",
//   "Weapons/Torches",
//   "Weapons/Heavy-Spears",
//   "Weapons/Colossal-Weapons",
//   "Weapons/Small-Shields",
//   "Weapons/Flails",
//   "Weapon",
//   "Weapons/Thrusting-Shields",
//   "Weapons/Katanas",
//   "Weapons/Curved-Greatswords",
//   "Weapons/Whips",
//   "Weapons/Hand-to-Hand",
//   "Spell",
//   "Weapons/Colossal-Swords",
//   "Weapons/Greataxes",
//   "Weapons/Perfume-Bottles",
//   "Weapons/Throwing-Blades",
//   "Weapons/Reverse-hand-Blades",
//   "Weapons/Light-Greatswords",
//   "Weapons/Staves",
//   "Talisman",
//   "Weapons/Greatbows",
//   "Weapons/Heavy-Thrusting-Swords",
//   "Weapons/Ballistas",
//   "Great Rune",
// ];
