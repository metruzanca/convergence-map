## Elden Ring tile map

Heavily inspired by Fextralife's map of elden ring. I wanted to bring something similar to mods of the game.

## Todolist

- [ ] Design URL API that allows for (probably all query params)
  - [ ] settings coordinates and zoom level
  - [ ] Set a focussed item
    - When specific item is focussed, only important landmarks should be enabled.
- [ ] Allow map to be used as stand alone and embedded into a site.
- [ ] Maps pins as svg icons
  - Hovering the pins should show a snippet of information, possibly an image. Possibly an iframe of the wiki itself. (very obsidian style!)
- [ ] Filtering map pins

### Things needed from Convergence Team

- [ ] Map coordinates for items in mod
  - Which then needs to be wired up into the map and some offset figured out to scale the coordinate systems to align
- [ ] High quality map asset files rip'd
  - So that they can be sliced and magick'd to be used as map tiles (just like fextra and similar sites did)
- [ ] Icons for pins (probably can find some Free pngs/svgs to use for this purpose)
- [ ] Maybe, low-res versions of item preview in inventory to be used on the actual map as pins
  - would need to be really small to not be a burden downloading these. Maybe show svgs until downloaded)
