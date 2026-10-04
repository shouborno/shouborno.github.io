import yaml from "js-yaml";
import { parseBib } from "./bib.js";
import profileSrc from "../data/profile.yaml?raw";
import projectsSrc from "../data/projects.yaml?raw";
import bibSrc from "../data/publications.bib?raw";

export const profile = yaml.load(profileSrc);
export const projects = yaml.load(projectsSrc);
export const publications = parseBib(bibSrc).sort((a, b) => Number(b.year) - Number(a.year));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function month(ym) {
  if (ym === "present") return "present";
  const [y, m] = String(ym).split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}
