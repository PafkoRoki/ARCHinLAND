import igorImage1 from '../assets/ProjectCatalog/Igor1.png'
import igorImage2 from '../assets/ProjectCatalog/Igor2.png'
import igorImage3 from '../assets/ProjectCatalog/Igor3.png'
import nastjaImage1 from '../assets/ProjectCatalog/Nastja1.png'
import nastjaImage2 from '../assets/ProjectCatalog/Nastja2.png'
import nastjaImage3 from '../assets/ProjectCatalog/Nastja3.png'

export interface Project {
  id: string;
  name: string;
  category: "do 70m²" | "Tradycyjny" | "Stodoła" | "Parterowy";

  image: string;

  usableArea: number;
  buildingArea: number;
  residentialArea: number;
  totalArea: number;

  floors: number;
  rooms: number;

  roofType: "🡶" | "🡵" | "🡲";
  roofAngle: number;

  garage: 0 | 1 | 2;

  plotWidth: number;
  plotLength: number;

  standard: "WT 2021" | "Energooszczędny";
  price: number;
}

export const projects: Project[] = [
  {
    id: "i-001",
    name: "IGOR z garażem",
    category: "do 70m²",
    image: igorImage1,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 45,
    garage: 1,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "i-002",
    name: "IGOR bliźniak",
    category: "do 70m²",
    image: igorImage2,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 45,
    garage: 1,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "i-003",
    name: "IGOR szeregowiec",
    category: "do 70m²",
    image: igorImage3,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 45,
    garage: 1,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "n-001",
    name: "NASTJA z garażem",
    category: "do 70m²",
    image: nastjaImage1,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 30,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "n-002",
    name: "NASTJA bliźniak",
    category: "do 70m²",
    image: nastjaImage2,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 30,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "n-003",
    name: "NASTJA szeregowiec",
    category: "do 70m²",
    image: nastjaImage3,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "🡶",
    roofAngle: 30,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    price: 1000,
  },
]