import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private getQuery(query: string): string {
    const urlService = 'https://pokemon-pichincha.herokuapp.com/pokemons/';
    return urlService + query;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  public getPokemons() {
    console.log(this.getQuery('?idAuthor=1'));
    return this.http.get(this.getQuery('?idAuthor=1'));
  }

  public postPokemon(pokemon: Pokemon) {
    return this.http.post<any>(this.getQuery('?idAuthor=1'), pokemon, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', pokemon))
      );
  }

  public updatePokemon(idPokemon: number, pokemon: Pokemon) {
    return this.http.put<any>(this.getQuery(`${idPokemon}`), pokemon, this.httpOptions)
      .pipe(
        catchError(this.handleError('addSmartphone', pokemon))
      );
  }

  public deletePokemon(idPokemon: number) {
    return this.http.delete(this.getQuery(`${idPokemon}`));
  }
}

export class Pokemon {
  name: string;
  image: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  idAuthor = 1;
}
