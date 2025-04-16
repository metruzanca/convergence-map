## Elden Ring tile map

Heavily inspired by Fextralife's map of elden ring. I wanted to bring something similar to mods of the game.

## Resources

- [Firebase Project](https://console.firebase.google.com/u/2/project/convergence-mod-map/overview)

---

### TODO

- UI Kits to look at:

  - https://ark-ui.com
  - https://kobalte.dev

## Project Features (todolist)

### Map Package

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

### Slicer Package

- From raw `.tga` files, produce leafletjs tiles
  - [ ] Improve offsets logic and crop scadutree tiles
- [ ] Move JS code for processing game item files to slicer package

### Misc

- [ ] See if Lord Exelot is willing to give me C# code so that code so that I we can have "all map tools" in one place.
  - Would happily convert my go code to C#.
