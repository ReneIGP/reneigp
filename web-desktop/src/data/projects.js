export const projects = [
  {
    id: "main-site",
    name: "ReneIGP.se",
    type: "page",
    url: "/",
    icon: "https://www.svgrepo.com/show/532195/app-indicator.svg",
    launch: { type: "iframe", width: 1024, height: 640 }
  },
  {
    id: "mapventure",
    name: "Mapventure",
    type: "readme",
    icon: "https://www.svgrepo.com/show/512317/github-142.svg",
    url: "https://reneigp.github.io/Mapventure/",
    launch: { width: "600px", height: "500px" }
  },
  {
    id: "courtFinder",
    name: "Court Finder",
    type: "readme",
    icon: "https://www.svgrepo.com/show/512317/github-142.svg",
    url: "https://reneigp.github.io/CourtFinder/",
    launch: { width: "600px", height: "500px" }
  },
  {
    // Opens in a new tab: the emulator needs cross-origin isolation, which an iframe here can't get
    id: "gba-player",
    name: "GBA Player",
    type: "link",
    icon: "/gba/icon.svg",
    url: "/gba/"
  }
];
