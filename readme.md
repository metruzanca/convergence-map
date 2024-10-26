# Elden Ring map slicer

Used to slice elden ring .tga map files into [leaflet](https://leafletjs.com) map tiles.

## Usage

Currently doesn't do much and has no knowledge of the different maps types.

```
make slice <file>
```

The files to slice, you must get yourself. I cannot provide those here (_also they're like 420mb each_).

## Project goals

- [ ] Given a .tga file, generate tiles for leaflet.

## Todolist

- [ ] Find x,y coordinates where the map ends.
- [ ] Exponentially divide the map 1 tile -> 4 tiles -> 16 tiles. etc.
- [ ] See how many zoom levels are needed

## Resources

- Logger used: https://github.com/charmbracelet/log
