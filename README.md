## Elden Ring tile map

Heavily inspired by Fextralife's map of elden ring. I wanted to bring something similar to mods of the game.

## Project Features

### Map - Web UI

- [ ] UI Kits to look at: [ark-ui](https://ark-ui.com), [kobalte](https://kobalte.dev)
- Full screen map
  - Item search: search by name, go to item on map & show marker or copy link.
- [ ] Multiple maps
  - Overworld
  - Underworld
  - [ ] Scadutree (needs work in the slicer)
- Embeded map
  - Zoom in/out buttons
  - Button to go back to focussed item
  - Button to open in full-screen
- Query params
  - Auto-save `lat`, `lng`, & `item` on change for easy map sharing.
  - Auto-focus `item={item_name}` on load
- [ ] Map marker
  - [ ] Link to wiki (needs work)
- [ ] REMOVE firebase from deps
- [ ] Maybe drop sidebar in favour of a command pallete style search

- [ ] ASK Exelot, where is 0,0 in game? Is it by chance the exact center of the `.tga` map file?

### Slicer - Image & Data preprocessor

- From raw `.tga` files, produce leafletjs tiles
  - [ ] Improve offsets logic and crop scadutree tiles
- [ ] Move JS code for processing game item files to slicer package

### Misc

- [ ] See if Lord Exelot is willing to give me C# code so that code so that I we can have "all map tools" in one place.
  - Would happily convert my go code to C#.
