import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageableParams } from 'src/app/models/pageable-params.model';
import { PageableRequest } from 'src/app/models/pageable-request.model';
import { Pokemon } from 'src/app/models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _apiUrl = "https://pokeapi.co/api/v2"
  constructor(private http: HttpClient) { }

  getPokemon(queryParams: PageableParams): Observable<PageableRequest<Pokemon>> {
    return this.http.get<PageableRequest<Pokemon>>(
      `${this._apiUrl}/pokemon/?limit=${queryParams.limit}&offset=${queryParams.offset}`
    )
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(
      `${this._apiUrl}/pokemon/${id}`
    )
  }
}
