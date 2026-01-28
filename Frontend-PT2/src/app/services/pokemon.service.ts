import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

@Injectable({ providedIn: "root" })
export class PokemonService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:5132/api/pokemon";

  getPokemons(
    limit: number,
    offset: number,
    name: string = "",
    type: string = "",
  ): Observable<Pokemon[]> {
    let params = new HttpParams();

    if (name) {
      params = params.set("name", name);
    } else {
      params = params.set("limit", limit).set("offset", offset);
      if (type) params = params.set("type", type);
    }

    return this.http.get<Pokemon[]>(this.apiUrl, { params });
  }
}
