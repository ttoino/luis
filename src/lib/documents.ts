export interface Champion {
    aliases: string[];
    id: string;
    image: string;
    name: string;
    origin?: Region;
    quote: string;
    races: string[];
    related_champions: string[];
    release_date: string;
    roles: string[];
    skins: string[];
    title: string;
    type: "champion";
}

export interface Region {
    associated_champions: string[];
    description: string;
    description_raw: string;
    id: string;
    image: string;
    name: string;
    type: "region";
}

export interface Story {
    author?: string;
    content: string;
    content_raw: string;
    date: string;
    entities: string[];
    id: string;
    image: string;
    "related_champions.aliases": string[];
    "related_champions.id": string[];
    "related_champions.image": string[];
    "related_champions.name": string[];
    "related_champions.origin.associated_champions": string[];
    "related_champions.origin.description": string[];
    "related_champions.origin.description_raw": string[];
    "related_champions.origin.id": string[];
    "related_champions.origin.image": string[];
    "related_champions.origin.name": string[];
    "related_champions.origin.type": "region"[];
    "related_champions.quote": string[];
    "related_champions.races": string[];
    "related_champions.related_champions": string[];
    "related_champions.release_date": string[];
    "related_champions.roles": string[];
    "related_champions.skins": string[];
    "related_champions.title": string[];
    "related_champions.type": "champion"[];
    title: string;
    type: "story";
    vector: number[];
}
