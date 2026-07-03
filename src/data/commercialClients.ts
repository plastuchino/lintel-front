// Here we need to install the logo for the commerical client.
import lowes from "../assets/lowesLogo.png"
import ross from "../assets/rossLogo.png"
import target from "../assets/targetLogo.png"


export interface CommercialClient {
  name: string;
  /** Path to a logo image asset (e.g. imported from `../assets/...`). Falls back to a text wordmark if omitted. */
  logo?: string;
}

export const COMMERCIAL_CLIENTS: CommercialClient[] = [
  { name: "Lowe's", logo:  lowes},
  { name: 'Ross', logo: ross },
  { name: 'Target', logo: target },
];
