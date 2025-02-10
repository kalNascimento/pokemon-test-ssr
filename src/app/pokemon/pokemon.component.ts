import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../services/pokemon/pokemon.service';
import { PageableRequest } from '../models/pageable-request.model';
import { Pokemon } from '../models/pokemon.model';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {
  protected pokemons!: PageableRequest<Pokemon>;
  protected pokemon!: Pokemon;

  protected index = 1;
  
  constructor(
    protected pokemonService: PokemonService,
    private meta: Meta,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      const id = Number(param['id']);
      this.getPokemonById(id ?? this.index)
    })
  }

  getPokemonById(id: number) {
    this.pokemonService.getPokemonById(id).subscribe((response) => {
      this.meta.updateTag({ name: 'description', content: response.name });
      this.pokemon = response;
      this.index = id;
    });
  }

  nextPokemon() {
    this.index = this.index + 1;
    this.getPokemonById(this.index);
    this.router.navigate(['pokemon', this.index]);
  }

  prevPokemon() {
    this.index = this.index - 1;
    if (this.index <= 0) this.index = 1;
    // this.getPokemonById(this.index);
    this.router.navigate(['pokemon', this.index]);
  }
}
