import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemons = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments.at(-2);
      return {
        no,
        name: name.toLocaleLowerCase(),
      };
    });
    this.pokemonService.fillPokemonsWithSeedData(pokemons);
    return 'Seed executed';
  }
}
